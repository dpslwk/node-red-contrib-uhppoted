const codec = require('./codec.js')
const dgram = require('dgram')
const os = require('os')
const ip = require('ip')
const opts = { type: 'udp4', reuseAddr: true }

module.exports = {
  /**
    * Executes a 'get' command to retrieve information from a UHPPOTE access controller.
    * 'get' and 'set' are functionally identical but are defined separately for
    * semantic clarity.
    *
    * @param {number}   deviceId The serial number for the target access controller
    * @param {byte}     op       Operation code from 'opcode' module
    * @param {object}   request  Operation parameters for use by codec.encode
    * @param {object}   context  Invoking node and configuration
    * @param {function} logger   Log function for sent/received messages
    *
    * @param {object}   Decoded reply containing the received information
    *
    * @author: TS
    * @exports
    */
  get: async function (deviceId, op, request, context, logger) {
    return exec(deviceId, op, request, context, logger)
  },

  /**
    * Executes a 'set' command to update information on a UHPPOTE access controller.
    * 'get' and 'set' are functionally identical but are defined separately for
    * semantic clarity.
    *
    * @param {number}   deviceId The serial number for the target access controller
    * @param {byte}     op       Operation code from 'opcode' module
    * @param {object}   request  Operation parameters for use by codec.encode
    * @param {object}   context  Invoking node and configuration
    * @param {function} logger   Log function for sent/received messages
    *
    * @param {object}  Decoded result of the operation
    *
    * @author: TS
    * @exports
    */
  set: async function (deviceId, op, request, context, logger) {
    return exec(deviceId, op, request, context, logger)
  },

  /**
    * Sends a command to update information on a UHPPOTE access controller without
    * expecting a reply. Used solely by the 'set-ip' node - the UHPPOTE access controller
    * does not reply to the set IP command.
    *
    * @param {number}   deviceId The serial number for the target access controller
    * @param {byte}     op       Operation code from 'opcode' module
    * @param {object}   request  Operation parameters for use by codec.encode
    * @param {object}   context  Invoking node and configuration
    * @param {function} logger   Log function for sent/received messages
    *
    * @author: TS
    */
  send: async function (deviceId, op, request, context, logger) {
    const c = configuration(deviceId, context.config, logger)
    const sock = dgram.createSocket(opts)
    const rq = codec.encode(context.node, op, deviceId, request)

    const onerror = new Promise((resolve, reject) => {
      sock.on('error', (err) => {
        reject(err)
      })
    })

    const receive = receiver(0)

    const send = new Promise((resolve, reject) => {
      sock.on('listening', () => {
        if (isBroadcast(c.addr.address)) {
          sock.setBroadcast(true)
        }

        sock.send(new Uint8Array(rq), 0, 64, c.addr.port, c.addr.address, (err, bytes) => {
          if (err) {
            reject(err)
          } else {
            log(c.debug, 'sent', rq, c.addr)
            resolve(bytes)
          }
        })
      })

      sock.bind({
        address: c.bind,
        port: 0
      })
    })

    sock.on('message', (message, rinfo) => {
      log(c.debug, 'received', message, rinfo)
    })

    try {
      const result = await Promise.race([onerror, Promise.all([receive, send])])

      if (result && result.length === 2) {
        return {}
      }
    } finally {
      sock.close()
    }

    throw new Error('no reply to request')
  },

  /**
    * Broadcasts a command to retrieve information from all responding UHPPOTE access
    * controllers. In this implementation it is used exclusively by the 'get-devices'
    * node.
    *
    * It differs from 'get' in that it waits for a timeout before returning an array of
    * received responses rather than returning the first received response. It also
    * explicity issues a UDP broadcast message - 'get' will issue a UDP 'sendto' if
    * possible.
    *
    * @param {number}   deviceId The serial number for the target access controller
    * @param {byte}     op       Operation code from 'opcode' module
    * @param {object}   request  Operation parameters for use by codec.encode
    * @param {object}   context  Invoking node and configuration
    * @param {function} logger   Log function for sent/received messages
    *
    * @param {array} Array of Javascript objects from codec.decode containing the decoded
    *                received responses.
    *
    * @author: TS
    * @exports
    */
  broadcast: async function (deviceId, op, request, context, logger) {
    const c = configuration(deviceId, context.config, logger)
    const sock = dgram.createSocket(opts)
    const rq = codec.encode(context.node, op, deviceId, request)

    const decode = function (reply) {
      if (reply) {
        const response = codec.decode(context.node, reply)
        if (response) {
          return response
        }
      }

      throw new Error('invalid reply to broadcasted request')
    }

    const onerror = new Promise((resolve, reject) => {
      sock.on('error', (err) => {
        reject(err)
      })
    })

    const receive = receiver(c.timeout)

    const send = new Promise((resolve, reject) => {
      sock.on('listening', () => {
        if (isBroadcast(c.addr.address)) {
          sock.setBroadcast(true)
        }

        sock.send(new Uint8Array(rq), 0, 64, c.addr.port, c.addr.address, (err, bytes) => {
          if (err) {
            reject(err)
            return
          }

          log(c.debug, 'sent', rq, c.addr)
          resolve(bytes)
        })
      })

      sock.bind({
        address: c.bind,
        port: 0
      })
    })

    sock.on('message', (message, rinfo) => {
      receive.received(message)
      log(c.debug, 'received', message, rinfo)
    })

    try {
      const result = await Promise.race([onerror, Promise.all([receive, send])])

      if (result && result.length === 2) {
        return receive.replies.map(reply => decode(reply))
      }
    } finally {
      sock.close()
    }
  },

  /**
    * Establishes a 'listening' UDP connection on the 'listen' port defined in the
    * configuration to receive events from UHPPOTE access controllers configured
    * to send events to this host:port. Received events are forwarded to the
    * supplied handler for dispatch to the application.
    *
    * @param {string}   bind     UDP address:port to bind to
    * @param {byte}     debug    Logs received messages to console if 'true'
    * @param {function} handler  Function to invoke with received event
    *
    * @author: TS
    * @exports
    */
  listen: function (bind, debug, handler) {
    const sock = dgram.createSocket(opts)

    sock.on('error', (err) => {
      handler.onerror(err)
    })

    sock.on('message', (message, rinfo) => {
      if (debug) {
        log(debug, 'received', message, rinfo)
      }

      handler.received(rinfo, message)
    })

    let address = '0.0.0.0'
    let port = 60001

    if (bind) {
      const re = /^(.*?)(?::([0-9]+))?$/
      const match = bind.match(re)

      if ((match.length > 1) && match[1]) {
        address = match[1]
      }

      if ((match.length > 2) && match[2]) {
        port = parseInt(match[2], 10)
      }
    }

    sock.bind({
      address: address,
      port: port
    })

    return sock
  }
}

/**
  * Sends a UDP command to a UHPPOTE access controller and returns the decoded
  * reply, for use by 'get' and 'set'.
  *
  * configuration to receive events from UHPPOTE access controllers configured
  * to send events to this host:port. Received events are forwarded to the
  * supplied handler for dispatch to the application.
  *
  * @param {number}   deviceId The serial number for the target access controller
  * @param {byte}     op       Operation code from 'opcode' module
  * @param {object}   request  Operation parameters for use by codec.encode
  * @param {object}   context  Invoking node and configuration
  * @param {function} logger   Log function for sent/received messages
  *
  * @param {object}  Decoded reply from access controller
  *
  * @author: TS
  */
async function exec (deviceId, op, request, context, logger) {
  const c = configuration(deviceId, context.config, logger)
  const sock = dgram.createSocket(opts)
  const rq = codec.encode(context.node, op, deviceId, request)
  let received = () => {}

  const decode = function (reply) {
    if (reply) {
      const response = codec.decode(context.node, reply)
      if (response && (response.deviceId === deviceId)) {
        return response
      }
    }

    throw new Error(`no reply from ${deviceId}`)
  }

  const onerror = new Promise((resolve, reject) => {
    sock.on('error', (err) => {
      reject(err)
    })
  })

  const wait = new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('timeout'))
    }, c.timeout)

    received = (reply) => {
      clearTimeout(timer)
      resolve(reply)
    }
  })

  const send = new Promise((resolve, reject) => {
    sock.on('listening', () => {
      if (isBroadcast(c.addr.address)) {
        sock.setBroadcast(true)
      }

      sock.send(new Uint8Array(rq), 0, 64, c.addr.port, c.addr.address, (err, bytes) => {
        if (err) {
          reject(err)
        } else {
          log(c.debug, 'sent', rq, c.addr)
          resolve(bytes)
        }
      })
    })

    sock.bind({
      address: c.bind,
      port: 0
    })
  })

  sock.on('message', (message, rinfo) => {
    log(c.debug, 'received', message, rinfo)

    if (received) {
      received(new Uint8Array(message))
    }
  })

  try {
    const result = await Promise.race([onerror, Promise.all([wait, send])])

    if (result && result.length > 0) {
      return decode(result[0])
    }
  } finally {
    sock.close()
  }

  throw new Error('no reply to request')
}

/**
  * Utility function to reconcile supplied configuration against the default
  * values. Returns a working configuration with valid:
  * - UDP bind address:port
  * - UDP destination address:port
  * - timeout
  * - debug enabled
  *
  * @param {number}   deviceId The serial number for the target access controller
  * @param {object}   config   Configuration object supplied to requesting node
  * @param {function} logger   Log function for sent/received messages
  *
  * @param {object} Valid working configuration
  *
  * @author: TS
  */
function configuration (deviceId, config, logger) {
  let timeout = 5000
  let bind = '0.0.0.0'
  let dest = '255.255.255.255:60000'
  let debug = false

  if (config) {
    timeout = config.timeout
    bind = config.bind
    dest = config.broadcast
    debug = config.debug ? function (l, m) { logger(l + '\n' + m) } : null

    if (config.controllers) {
      try {
        const devices = JSON.parse(config.controllers)

        for (const [id, device] of Object.entries(devices)) {
          if (parseInt(id) === deviceId) {
            for (const [k, v] of Object.entries(device)) {
              if (k === 'address') {
                dest = v
              }
            }
          }
        }
      } catch (error) {
        logger(`Error parsing config.controllers JSON ${error}`)
      }
    }
  }

  return {
    timeout: timeout,
    bind: bind,
    addr: stringToIP(dest),
    debug: debug
  }
}

/**
  * Utility function to write a sent/received UDP message to the log function.
  *
  * @param {function}   debug  The log function that will write the formatted message
  * @param {string}     label  'sent' or 'received'
  * @param {uint8array} message 64 byte UDP message
  * @param {object}     rinfo   source/destination IP address and port
  *
  * @author: TS
  */
function log (debug, label, message, rinfo) {
  let description = label

  if (rinfo) {
    description = `${label} ${rinfo.address}:${rinfo.port}`
  }

  if (debug) {
    if (typeof debug === 'function') {
      const pad = ' '.repeat(25)
      debug(description, pad + format(message, pad))
    } else {
      const prefix = ' '.repeat(18)
      const pad = ' '.repeat(26)
      console.log(prefix + '[debug] ' + description + '\n' + pad + format(message, pad))
    }
  }
}

/**
  * Utility function to format a 64 byte UDP message.
  *
  * @param {uint8array} message 64 byte UDP message
  * @param {string}     pad     prefix used to align the message to the log entries
  *
  * @returns {string} Message formatted as a hexadecimal chunk
  *
  * @author: TS
  */
function format (message, pad) {
  return message
    .toString('hex')
    .replace(/(.{2})/g, '$& ')
    .replace(/(.{24})/g, '$& ')
    .replace(/(.{50})/g, '$&\n' + pad)
    .trimEnd()
}

/**
  * Utility function to convert an IP address in host:port format an object with
  * address and port.
  *
  * @param {string} addr  IP address in host:port format
  *
  * @returns {object} Object containing IP address and port as properties
  *
  * @author: TS
  */
function stringToIP (addr) {
  let address = addr
  let port = 60000

  const re = /^(.*?)(?::([0-9]+))?$/
  const match = addr.match(re)

  if ((match.length > 1) && match[1]) {
    address = match[1]
  }

  if ((match.length > 2) && match[2]) {
    port = parseInt(match[2], 10)
  }

  return {
    address: address,
    port: port
  }
}

/**
  * Utility function that takes a best guess as to whether an IP address is likely to be
  * a broadcast address. It uses the OS interface list, returning 'true' if the address
  * matches one of the 'bit flipped' netmasks.
  *
  * @param {string} addr  IP address
  *
  * @returns {bool} 'true' if the address is a broadcast address. Defaults to 'false'.
  *
  * @author: TS
  */
function isBroadcast (addr) {
  const interfaces = os.networkInterfaces()

  for (const v of Object.entries(interfaces)) {
    for (const ifs of v[1]) {
      if (ifs.family && ifs.family === 'IPv4') {
        const subnet = ip.subnet(ifs.address, ifs.netmask)

        if (subnet.broadcastAddress === addr) {
          return true
        }
      }
    }
  }

  return false
}

/**
  * Utility function construct a Promise that can hold received replies while waiting
  * for a timeout. Intended to unifiy 'broadcast', 'send' and 'exec' but currently only
  * used by 'broadcast' and 'send', because Javascript..
  *
  * Ref. https://stackoverflow.com/questions/48158730/extend-javascript-promise-and-resolve-or-reject-it-inside-constructor
  *
  * @param {number} timeout  Timeout (in seconds)
  *
  * @returns {promise} Constructed Promised with an added 'replies' field and 'received' function.
  *
  * @author: TS
  */
function receiver (timeout) {
  const p = new Promise((resolve, reject) => {
    if (timeout > 0) {
      setTimeout(resolve, timeout)
    } else {
      resolve()
    }
  })

  p.replies = []
  p.received = (message) => { p.replies.push(new Uint8Array(message)) }

  return p
}
