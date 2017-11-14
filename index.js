const { Wechaty } = require('wechaty') 
const qrcode = require('qrcode-terminal')

Wechaty.instance() // Singleton
.on('scan', (url, code) => {
    if (!/201|200/.test(String(code))) {
      const loginUrl = url.replace(/\/qrcode\//, '/l/')
      qrcode.generate(loginUrl)
    }
    console.log(`${url}\n[${code}] Scan the QR Code above to login:`)
  })
.on('login', user => console.log(`User ${user} logged in`))
.on('message', message => console.log(`Message: ${message}`))
.init()