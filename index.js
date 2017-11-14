const { Wechaty } = require('wechaty') 
const qrcode = require('qrcode-terminal')

function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function remindme(msg)
{
  msgcontent = msg.content().replace('remindme', '')

  var hpos = msgcontent.indexOf('h')
  var mpos = msgcontent.indexOf('m')
  var spos = msgcontent.indexOf('s')

  var final = msgcontent.substring(spos+1)
  console.log(final)

  var hours = parseInt(msgcontent.substring(hpos-2,hpos))*3600000
  var mins = parseInt(msgcontent.substring(mpos-2,mpos))*60000
  console.log(mins)
  var secs = parseInt(msgcontent.substring(spos-2,spos))*1000
  console.log(secs)
  var total = 0
  total=hours+mins+secs

  console.log(hours+mins+secs)

  msg.room().say(`Noted!`)
  await sleep(total)
  msg.room().say(`TIME\'S UP! Here is the message you left for yourself:${final}`)
}

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
.on('message', message =>{
  var msgcontent = message.content()

  if(msgcontent.toLowerCase().startsWith('remindme'))
  {
    remindme(message)
  }
})
.init()