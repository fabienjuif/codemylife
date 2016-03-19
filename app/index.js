require('sugar')

// botkit side

const Botkit = require('botkit')
const nickNames = ['fabien.juif']

// Expect a SLACK_TOKEN environment variable
const slackToken = process.env.SLACK_TOKEN
if (!slackToken) {
    console.error('SLACK_TOKEN is required!')
    process.exit(1)
}

const controller = Botkit.slackbot()
const bot = controller.spawn({
    token: slackToken
})

bot.startRTM(function(err, bot, payload) {
    if (err) {
        throw new Error('Could not connect to Slack')
    }
})

nickNames.each(nickName => {
    require('./nick')(controller, nickName)
})

require('./narcade/narcade')(controller, ['fabien.juif', 'yvonnick'])

controller.hears('.*', ['mention', 'direct_mention', 'direct_message'], (bot, message) => {
    var channel = message.channel

    bot.reply(message, 'Tu as des remarques sur moi ?! C\'est ça ?!')

    setTimeout(() => {
        bot.say({
            channel: channel,
            text: 'Bon ok je ne suis pas infaillible, tu peux poster un bogue ici : https://github.com/fabienjuif/narcade-bot/issues'
        })
        setTimeout(() => {
          bot.say({
            channel: channel,
            text: '... essaie de taper "NArcade" ;)'
          })
        })
        /*setTimeout(() => {
            bot.say({
                channel: channel,
                text: 'Au fait ! Je connais les personnes suivantes : ' + nickNames.map(nickName => '@' + nickName)
            })
        }, 2000)*/
    }, 2000)
})

// Express side
// TODO : Split express and botkit code in distincts file
const app = require('express')()
const http = require('http').Server(app)
const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.post('/messages', (req, res) => {
    console.log(req.body)

    bot.say({
        channel: 'G0T2RQ1J5',
        text: req.body.text
    })

    res.end()
})

const port = 3000
http.listen(port, function() {
    console.log('Listening *:' + port)
})
