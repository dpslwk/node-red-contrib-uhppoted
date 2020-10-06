module.exports = function (RED) {
  const common = require('./common.js')
  const uhppoted = require('./uhppoted.js')
  const opcodes = require('../nodes/opcodes.js')

  function GetCardNode (config) {
    RED.nodes.createNode(this, config)

    const node = this
    const topic = config.topic
    const uhppote = RED.nodes.getNode(config.config)

    node.status({})

    this.on('input', function (msg, send, done) {
      const t = (topic && topic !== '') ? topic : msg.topic
      const deviceId = msg.payload.deviceId
      const cardNumber = msg.payload.cardNumber

      const emit = function (object) {
        let card = { topic: t, payload: object }
        let status = { topic: t, payload: { status: { code: 0, message: 'card ok' } } }

        switch (object.card.number) {
          case 0:
            card = null
            status = { topic: t, payload: { status: { code: -1, message: 'card not found' } } }
            break

          case 0xffffffff:
            card = null
            status = { topic: t, payload: { status: { code: -2, message: 'card deleted' } } }
            break
        }

        node.send([card, status])
      }

      const error = function (err) {
        common.error(node, err)
      }

      try {
        uhppoted.get(deviceId, opcodes.GetCardByID, { card: { number: cardNumber } }, uhppote, (m) => { node.log(m) })
          .then(object => { emit(object) })
          .then(done())
          .catch(err => { error(err) })
      } catch (err) { error(err) }
    })
  }

  RED.nodes.registerType('get-card', GetCardNode)
}
