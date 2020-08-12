module.exports = {

  broadcast: async function (bind, dest, request, timeout, debug) {
    const dgram = require('dgram')
    const opts = { type: 'udp4', reuseAddr: true }
    const sock = dgram.createSocket(opts)
    const replies = []
    const rq = new Uint8Array(64)

    rq.set(request)

    const onerror = new Promise((resolve, reject) => {
      sock.on('error', (err) => {
        reject(err)
      })
    })

    const wait = new Promise(resolve => {
      setTimeout(resolve, timeout)
    })

    const send = new Promise((resolve, reject) => {
      sock.on('listening', () => {
        sock.setBroadcast(true)

        if (debug) {
          console.log('request:', request)
        }

        sock.send(rq, 0, rq.length, 60000, dest, (err, bytes) => {
          if (err) {
            reject(err)
          } else {
            resolve(bytes)
          }
        })
      })

      sock.bind(0, bind)
    })

    sock.on('message', (message, remote) => {
      replies.push(new Uint8Array(message))

      if (debug) {
        console.log('reply:  ', message)
      }
    })

    try {
      await Promise.race([onerror, Promise.all([wait, send])])
    } finally {
      sock.close()
    }

    return replies
  },

  listen: function (bind, debug, handler) {
    const dgram = require('dgram')
    const opts = { type: 'udp4', reuseAddr: true }
    const sock = dgram.createSocket(opts)

    sock.on('error', (err) => {
      handler.onerror(err)
    })

    sock.on('message', (message, remote) => {
      if (debug) {
        console.log('reply:  ', message)
      }

      handler.received(remote, message)
    })

    sock.bind(60001, '192.168.1.100')

    return sock
  },

  deviceId: function (bytes, offset) {
    return bytes.getUint32(offset, true)
  },

  address: function (bytes, offset) {
    const ip = require('ip')

    return ip.fromLong(bytes.getUint32(offset, false))
  },

  uint32: function (bytes, offset) {
    return bytes.getUint32(offset, true)
  },

  uint8: function (bytes, offset) {
    return bytes.getUint8(offset, true)
  },

  bool: function (bytes, offset) {
    return bytes.getUint8(offset, true) === 0x01
  },

  hexify: function (slice) {
    const bytes = new Uint8Array(slice)
    const hex = []

    for (let i = 0; i < bytes.length; i++) {
      hex.push(('0' + bytes[i].toString(16)).slice(-2))
    }

    return hex
  },

  yyyymmddHHmmss: function (slice) {
    const bytes = new Uint8Array(slice)
    const timestamp = []

    for (let i = 0; i < bytes.length; i++) {
      timestamp.push((bytes[i] >>> 4).toString(10))
      timestamp.push((bytes[i] & 0x0f).toString(10))
    }

    timestamp.splice(12, 0, ':')
    timestamp.splice(10, 0, ':')
    timestamp.splice(8, 0, ' ')
    timestamp.splice(6, 0, '-')
    timestamp.splice(4, 0, '-')

    return timestamp.join('')
  },

  yyyymmdd: function (slice) {
    const bytes = new Uint8Array(slice)
    const date = []

    for (let i = 0; i < bytes.length; i++) {
      date.push((bytes[i] >>> 4).toString(10))
      date.push((bytes[i] & 0x0f).toString(10))
    }

    date.splice(6, 0, '-')
    date.splice(4, 0, '-')

    return date.join('')
  },

  yymmdd: function (slice) {
    const bytes = new Uint8Array(slice)
    const date = ['2', '0']

    for (let i = 0; i < bytes.length; i++) {
      date.push((bytes[i] >>> 4).toString(10))
      date.push((bytes[i] & 0x0f).toString(10))
    }

    date.splice(6, 0, '-')
    date.splice(4, 0, '-')

    return date.join('')
  },

  HHmmss: function (slice) {
    const bytes = new Uint8Array(slice)
    const time = []

    for (let i = 0; i < bytes.length; i++) {
      time.push((bytes[i] >>> 4).toString(10))
      time.push((bytes[i] & 0x0f).toString(10))
    }

    time.splice(4, 0, ':')
    time.splice(2, 0, ':')

    return time.join('')
  }
}
