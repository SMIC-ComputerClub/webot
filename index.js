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

  msg.say(`Noted!`)
  await sleep(total)
  msg.say(`TIME\'S UP! Here is the message you left for yourself:${final}`)
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
  .on('message', message => console.log(`${message.from().name()}: ${message.content()}`))
  .on('message', message => {
    var msgcontent = message.content()

    if (msgcontent.toLowerCase().startsWith('remindme')) {
      remindme(message)
    }

    if (msgcontent.toLowerCase().startsWith('add')) {
      let item = msgcontent.replace('add ', '')
      let userData = [message.from().name(), item]
      if(data.length == 0)
      {
        data.push(userData)
        message.say('Item added!')
      }
      else
      {
        let counter = 0
        for(let i=0; i<data.length; i++)
        {
          if(data[i][0] == message.from().name())
          {
            console.log('list exists')
            data[i].push(item)
            counter++
            message.say('Item added!')
            break
          }
        }
        if(counter == 0)
        {
          data.push(userData)
          message.say(`Item added!`)
        }
      }
      console.log(data)
    }

    if (msgcontent.toLowerCase().startsWith('remove')) {
      let index = parseInt(msgcontent.replace('remove ', ''))
      if(data.length == 0)
      {
        message.say('There is nothing to remove!')
      }

      let counter = 0

      for(let i=0; i<data.length; i++)  
      {

        if (data[i].length==1)
        {
          message.say('You have nothing in your list to remove!')
          break
        }
        else if((data[i][0] == message.from().name()))
        {
          data[i].splice(index, 1)
          counter++
          message.say(`Successfully removed!`)
          break
        }        
      }
      if(counter == 0)
      {
        message.say('Incorrect usage of the remove command')
      }
      console.log(data)
    }

    if (msgcontent.toLowerCase().startsWith('list')) {
      if (data.length == 0) {
        message.say('You have nothing in your list!')
      }
      
      for(let i = 0; i<data.length; i++)
      {
        if(data[i].length ==1)
        {
          message.say('You have nothing in your list!')
        }
        else if(data[i][0] == message.from().name())
        {
          let listmsg = ''
          for(let z = 1; z<data[i].length; z++)
          {
            listmsg += `${z}. ${data[i][z]}\n`
          }
          message.say(listmsg)
        }
      }
    }
  })
  .start()