// const helper = require('node-red-node-test-helper')
const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const codec = require('../nodes/codec.js')

describe('codec', function () {
  describe('#encode(...)', function () {
    it('should fail with error when encoding an invalid function code', function () {
      expect(() => { codec.encode(0xff) }).to.throw('invalid protocol function code 255')
    })

    it('should encode get-devices request', function () {
      const msg = Buffer.from([
        0x17, 0x94, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const bytes = codec.encode(0x94)

      expect(bytes).to.deep.equal(msg)
    })

    it('should encode get-device request', function () {
      const msg = Buffer.from([
        0x17, 0x94, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const bytes = codec.encode(0x94, 405419896)

      expect(bytes).to.deep.equal(msg)
    })

    it('should encode set-address request', function () {
      const msg = Buffer.from([
        0x17, 0x96, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0xc0, 0xa8, 0x01, 0x7d, 0xff, 0xff, 0xff, 0x00,
        0xc0, 0xa8, 0x00, 0x01, 0x55, 0xaa, 0xaa, 0x55, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const bytes = codec.encode(0x96, 405419896, {
        address: '192.168.1.125',
        netmask: '255.255.255.0',
        gateway: '192.168.0.1'
      })

      expect(bytes).to.deep.equal(msg)
    })

    it('should encode get-status request', function () {
      const msg = Buffer.from([
        0x17, 0x20, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const bytes = codec.encode(0x20, 405419896)

      expect(bytes).to.deep.equal(msg)
    })

    it('should encode get-listener request', function () {
      const msg = Buffer.from([
        0x17, 0x92, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const bytes = codec.encode(0x92, 405419896)

      expect(bytes).to.deep.equal(msg)
    })

    it('should encode set-listener request', function () {
      const msg = Buffer.from([
        0x17, 0x90, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0xc0, 0xa8, 0x01, 0x64, 0x61, 0xea, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const bytes = codec.encode(0x90, 405419896, { address: '192.168.1.100', port: 60001 })

      expect(bytes).to.deep.equal(msg)
    })

    it('should encode get-time request', function () {
      const msg = Buffer.from([
        0x17, 0x32, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const bytes = codec.encode(0x32, 405419896)

      expect(bytes).to.deep.equal(msg)
    })

    it('should encode set-time request', function () {
      const msg = Buffer.from([
        0x17, 0x30, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x20, 0x21, 0x08, 0x29, 0x13, 0x45, 0x51, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const bytes = codec.encode(0x30, 405419896, { datetime: '2021-08-29 13:45:51' })

      expect(bytes).to.deep.equal(msg)
    })

    it('should encode get-door-control request', function () {
      const msg = Buffer.from([
        0x17, 0x82, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const bytes = codec.encode(0x82, 405419896, { door: 3 })

      expect(bytes).to.deep.equal(msg)
    })

    it('should encode set-door-control request', function () {
      const msg = Buffer.from([
        0x17, 0x80, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x03, 0x02, 0x09, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const bytes = codec.encode(0x80, 405419896, { door: 3, delay: 9, control: 'normally closed' })

      expect(bytes).to.deep.equal(msg)
    })

    it('should encode open-door request', function () {
      const msg = Buffer.from([
        0x17, 0x40, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const bytes = codec.encode(0x40, 405419896, { door: 3 })

      expect(bytes).to.deep.equal(msg)
    })

    it('should encode get-cards request', function () {
      const msg = Buffer.from([
        0x17, 0x58, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const bytes = codec.encode(0x58, 405419896)

      expect(bytes).to.deep.equal(msg)
    })

    it('should encode get-card request', function () {
      const msg = Buffer.from([
        0x17, 0x5a, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0xa4, 0xea, 0xaa, 0x03, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const bytes = codec.encode(0x5a, 405419896, { cardNumber: 61532836 })

      expect(bytes).to.deep.equal(msg)
    })

    it('should encode put-card request', function () {
      const msg = Buffer.from([
        0x17, 0x50, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0xa4, 0xea, 0xaa, 0x03, 0x20, 0x19, 0x01, 0x02,
        0x20, 0x21, 0x12, 0x31, 0x01, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const bytes = codec.encode(0x50, 405419896, {
        card: {
          number: 61532836,
          valid: {
            from: '2019-01-02',
            to: '2021-12-31'
          },
          doors: {
            1: true,
            2: true,
            3: false,
            4: true
          }
        }
      })

      expect(bytes).to.deep.equal(msg)
    })
  })

  describe('#decode(...)', function () {
    it('should return null when decoding an invalid function code', function () {
      const msg = Buffer.from([
        0x17, 0xff, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0xc0, 0xa8, 0x01, 0x64, 0xff, 0xff, 0xff, 0x00,
        0xc0, 0xa8, 0x01, 0x01, 0x00, 0x12, 0x23, 0x34, 0x45, 0x56, 0x08, 0x92, 0x20, 0x20, 0x08, 0x25,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.equal(null) // don't particularly want to import the 'null' function from chai
    })

    it('should decode get-device response', function () {
      const expected = {
        deviceId: 405419896,
        device: {
          serialNumber: 405419896,
          address: '192.168.1.100',
          netmask: '255.255.255.0',
          gateway: '192.168.1.1',
          MAC: '00:12:23:34:45:56',
          version: '0892',
          date: '2020-08-25'
        }
      }

      const msg = Buffer.from([
        0x17, 0x94, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0xc0, 0xa8, 0x01, 0x64, 0xff, 0xff, 0xff, 0x00,
        0xc0, 0xa8, 0x01, 0x01, 0x00, 0x12, 0x23, 0x34, 0x45, 0x56, 0x08, 0x92, 0x20, 0x20, 0x08, 0x25,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.deep.equal(expected)
    })

    it('should decode get-status response', function () {
      const expected = {
        deviceId: 405419896,
        state: {
          serialNumber: 405419896,
          event: {
            index: 71,
            type: {
              code: 1,
              event: 'card swipe'
            },
            granted: false,
            door: 3,
            direction: {
              code: 1,
              direction: 'in'
            },
            card: 65538,
            timestamp: '2020-08-25 10:08:40',
            reason: {
              code: 6,
              reason: 'no access rights'
            }
          },
          doors: [false, false, false, false],
          buttons: [false, false, false, false],
          system: {
            status: 0,
            date: '2020-08-25',
            time: '10:08:40'
          },
          specialInfo: 0,
          relays: {
            state: 0,
            relays: { 1: false, 2: false, 3: false, 4: false }
          },
          inputs: {
            state: 0,
            forceLock: false,
            fireAlarm: false
          }
        }
      }

      const msg = Buffer.from([
        0x17, 0x20, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x47, 0x00, 0x00, 0x00, 0x01, 0x00, 0x03, 0x01,
        0x02, 0x00, 0x01, 0x00, 0x20, 0x20, 0x08, 0x25, 0x10, 0x08, 0x40, 0x06, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x08, 0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x20, 0x08, 0x25, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.deep.equal(expected)
    })

    it('should decode get-listener response', function () {
      const expected = {
        deviceId: 405419896,
        address: '192.168.1.100',
        port: 60001
      }

      const msg = Buffer.from([
        0x17, 0x92, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0xc0, 0xa8, 0x01, 0x64, 0x61, 0xea, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.deep.equal(expected)
    })

    it('should decode set-listener response', function () {
      const expected = {
        deviceId: 405419896,
        updated: true
      }

      const msg = Buffer.from([
        0x17, 0x90, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.deep.equal(expected)
    })

    it('should decode get-time response', function () {
      const expected = {
        deviceId: 405419896,
        address: '192.168.1.225',
        port: 59999
      }

      const msg = Buffer.from([
        0x17, 0x92, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0xc0, 0xa8, 0x01, 0xe1, 0x5f, 0xea, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.deep.equal(expected)
    })

    it('should decode set-time response', function () {
      const expected = {
        deviceId: 405419896,
        datetime: '2021-08-28 14:23:56'
      }

      const msg = Buffer.from([
        0x17, 0x30, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x20, 0x21, 0x08, 0x28, 0x14, 0x23, 0x56, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.deep.equal(expected)
    })

    it('should decode get-door-control response', function () {
      const expected = {
        deviceId: 405419896,
        doorControlState: {
          door: 4,
          delay: 7,
          control: {
            value: 3,
            state: 'controlled'
          }
        }
      }

      const msg = Buffer.from([
        0x17, 0x82, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x04, 0x03, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.deep.equal(expected)
    })

    it('should decode set-door-control response', function () {
      const expected = {
        deviceId: 405419896,
        doorControlState: {
          door: 4,
          delay: 7,
          control: {
            value: 3,
            state: 'controlled'
          }
        }
      }

      const msg = Buffer.from([
        0x17, 0x80, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x04, 0x03, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.deep.equal(expected)
    })

    it('should decode open-door response', function () {
      const expected = {
        deviceId: 405419896,
        opened: true
      }

      const msg = Buffer.from([
        0x17, 0x40, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.deep.equal(expected)
    })

    it('should decode get-cards response', function () {
      const expected = {
        deviceId: 405419896,
        cards: 16781091
      }

      const msg = Buffer.from([
        0x17, 0x58, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x23, 0x0f, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.deep.equal(expected)
    })

    it('should decode get-card response', function () {
      const expected = {
        deviceId: 405419896,
        card: {
          number: 61532836,
          valid: {
            from: '2021-01-02',
            to: '2021-12-31'
          },
          doors: {
            1: true,
            2: true,
            3: false,
            4: true
          }
        }
      }

      const msg = Buffer.from([
        0x17, 0x5a, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0xa4, 0xea, 0xaa, 0x03, 0x20, 0x21, 0x01, 0x02,
        0x20, 0x21, 0x12, 0x31, 0x01, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.deep.equal(expected)
    })

    it('should decode "not found" get-card response', function () {
      const expected = {
        deviceId: 405419896,
        card: {
          number: 0,
          valid: {
            from: '',
            to: ''
          },
          doors: {
            1: false,
            2: false,
            3: false,
            4: false
          }
        }
      }

      const msg = Buffer.from([
        0x17, 0x5a, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.deep.equal(expected)
    })

    it('should decode "deleted" get-card response', function () {
      const expected = {
        deviceId: 405419896,
        card: {
          number: 4294967295,
          valid: {
            from: '',
            to: ''
          },
          doors: {
            1: false,
            2: false,
            3: false,
            4: false
          }
        }
      }

      const msg = Buffer.from([
        0x17, 0x5a, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.deep.equal(expected)
    })

    it('should decode put response', function () {
      const expected = {
        deviceId: 405419896,
        stored: true
      }

      const msg = Buffer.from([
        0x17, 0x50, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.deep.equal(expected)
    })

    it('should decode event message', function () {
      const expected = {
        deviceId: 405419896,
        state: {
          serialNumber: 405419896,
          event: {
            index: 71,
            type: {
              code: 1,
              event: 'card swipe'
            },
            granted: false,
            door: 3,
            direction: {
              code: 1,
              direction: 'in'
            },
            card: 65538,
            timestamp: '2020-08-25 10:08:40',
            reason: {
              code: 6,
              reason: 'no access rights'
            }
          },
          doors: [false, false, false, false],
          buttons: [false, false, false, false],
          system: {
            status: 0,
            date: '2020-08-25',
            time: '10:08:40'
          },
          specialInfo: 0,
          relays: {
            state: 0,
            relays: { 1: false, 2: false, 3: false, 4: false }
          },
          inputs: {
            state: 0,
            forceLock: false,
            fireAlarm: false
          }
        }
      }

      const msg = Buffer.from([
        0x17, 0x20, 0x00, 0x00, 0x78, 0x37, 0x2a, 0x18, 0x47, 0x00, 0x00, 0x00, 0x01, 0x00, 0x03, 0x01,
        0x02, 0x00, 0x01, 0x00, 0x20, 0x20, 0x08, 0x25, 0x10, 0x08, 0x40, 0x06, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x10, 0x08, 0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x20, 0x08, 0x25, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])

      const object = codec.decode(new Uint8Array(msg))

      expect(object).to.deep.equal(expected)
    })
  })
})
