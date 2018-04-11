let data = []

const { Wechaty } = require('wechaty')
const qrcode = require('qrcode-terminal')

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
      msgcontent = msgcontent.toLowerCase()
      let item = msgcontent.replace('add ', '')
      let userData = [message.from().name(), item]
      if(data.length == 0)
      {
        data.push(userData)
        message.room().say('Item added!')
      }
      else
      {
        for(let i=0; i<data.length; i++)
        {
          if(data[i][0] == message.from().name())
          {
            console.log('exists')
            data[i].push(item)
            message.room().say('Item added!')
          }
          else
          {
            data.push(userData)
            message.room().say('Item added!')
          }
        }
      }
      console.log(data)
    }

    if (msgcontent.toLowerCase().startsWith('remove')) {
      msgcontent = msgcontent.toLowerCase()
      let index = parseInt(msgcontent.replace('remove ', '')) - 1
      console.log(index)
      for(let i=0; i<data.length; i++)  
      {
        if (data.length==0)
        {
          message.room().say('You have nothing in your list to remove!')
        }
        else if (data[i].length==1)
        {
          message.room().say('You have nothing in your list to remove!')
        }
        else
        {
          data.splice(index, 1)
          message.room().say('Item removed!')
        }
      }
    }

    if (msgcontent.toLowerCase().startsWith('list')) {
      if (data.length == 0) {
        message.room().say('You have nothing in your list!')
      } else {
        let listmsg = ''
        for (let i = 0; i < data.length; i++) {
          for(let z = 0; z< data[z].length-1; z++)
          listmsg += `${z+1}. ${data[i][z+1]}\n`
        }
        message.room().say(listmsg)
      }
    }
  })
  .start()