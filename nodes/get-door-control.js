module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function GetDoorControlNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    common.ok(node)

    this.on('input', function (msg, send, done) {
      const t = (topic && topic !== '') ? topic : msg.topic
      const deviceId = msg.payload.deviceId
      const door = msg.payload.door

      const emit = function (object) {
        common.emit(node, t, object)
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        uhppoted.get(deviceId, opcodes.GetDoorControl, { door: door }, { node: node, config: uhppote }, (m) => { node.log(m) })
          .then(object => { emit(object) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })

    this.translate = function (text) {
      switch (text) {
        case 'normally open':
          return RED._('get-door-control.normallyOpen')

        case 'normally closed':
          return RED._('get-door-control.normallyClosed')

        case 'controlled':
          return RED._('get-door-control.controlled')

        case 'unknown':
          return RED._('get-door-control.unknown')
      }

      return text
    }
  }

  RED.nodes.registerType('get-door-control', GetDoorControlNode)
}
