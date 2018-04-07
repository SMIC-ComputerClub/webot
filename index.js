let userData = []

const {
  Wechaty
} = require('wechaty')
const qrcode = require('qrcode-terminal')

var todo = []

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function remindme(msg) {
  msgcontent = msg.content().replace('remindme', '')

  var hpos = msgcontent.indexOf('h')
  var mpos = msgcontent.indexOf('m')
  var spos = msgcontent.indexOf('s')

  var final = msgcontent.substring(spos + 1)
  console.log(final)

  var hours = parseInt(msgcontent.substring(hpos - 2, hpos)) * 3600000
  var mins = parseInt(msgcontent.substring(mpos - 2, mpos)) * 60000
  console.log(mins)
  var secs = parseInt(msgcontent.substring(spos - 2, spos)) * 1000
  console.log(secs)
  var total = 0
  total = hours + mins + secs

  console.log(hours + mins + secs)

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
    console.log(`${url}\n[${code}] Scan the QR Code above to log in:`)
  })
  .on('login', user => console.log(`User ${user} logged in`))
  .on('message', message => console.log(`Message: ${message}`))
  .on('message', message => {
    var msgcontent = message.content()

    if (msgcontent.toLowerCase().startsWith('remindme')) {
      remindme(message)
    }

    if (msgcontent.toLowerCase().startsWith('add')) {
      msgconent = msgcontent.toLowerCase()
      var item = msgcontent.replace('add ', '')
      todo.push(item)
      message.room().say('Item added!')
    }

    if (msgcontent.toLowerCase().startsWith('remove')) {
      msgconent = msgcontent.toLowerCase()
      var index = parseInt(msgcontent.replace('remove ', '')) - 1
      console.log(index)
      todo.splice(index, 1)
      message.room().say('Item removed!')
    }

    if (msgcontent.toLowerCase().startsWith('list')) {
      if (todo.length == 0) {
        message.room().say('You have nothing in your list!')
      } else {
        var listmsg = ''
        for (i = 0; i < todo.length; i++) {
          listmsg += `${i+1}. ${todo[i]}\n`
        }
        message.room().say(listmsg)
      }
    }
  })
  .start()