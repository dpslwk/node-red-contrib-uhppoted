module.exports = function (RED) {
  const uhppoted = require('./uhppoted.js')
  const codec = require('./codec.js')

  function GetDeviceNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const uhppote = RED.nodes.getNode(config.uhppote)

    let timeout = 5000
    let bind = '0.0.0.0'
    let dest = '255.255.255.255:60000'
    let debug = false

    if (uhppote) {
      timeout = uhppote.timeout
      bind = uhppote.bind
      dest = uhppote.broadcast
      debug = uhppote.debug ? function (l, m) { node.log(l + '\n' + m) } : null
    }

    this.status({})

    this.on('input', function (msg, send, done) {
      const deviceId = msg.payload.deviceId

      const decode = function (deviceid, reply) {
        if (reply) {
          const response = codec.decode(reply)

          if (response && (response.deviceId === deviceId) && response.device) {
            return response
          }
        }

        throw new Error(`no reply to get-device request for device ID ${deviceId}`)
      }

      const emit = function (device) {
        msg.payload = device
        send(msg)
      }

      try {
        const request = codec.encode(0x94, deviceId)

        uhppoted.execute(bind, dest, request, timeout, debug)
          .then(reply => { return decode(this.deviceid, reply) })
          .then(object => { return emit(object) })
          .then(done())
          .catch(err => {
            node.status({ fill: 'red', shape: 'dot', text: 'error' })
            node.warn('uhppoted::execute  ' + err)
          })
      } catch (err) {
        node.status({ fill: 'red', shape: 'dot', text: 'error' })
        node.warn('uhppoted::execute  ' + err)
      }
    })

    this.on('close', function () {
    })
  }

  RED.nodes.registerType('get-device', GetDeviceNode)
}
