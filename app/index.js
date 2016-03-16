'use strict'

require('sugar')
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

controller.hears('.*', ['mention'], (bot, message) => {
    bot.startConversation(message, (err, conversation) => {
        conversation.say('Tu as des remarques sur moi ?! C\'est ça ?!')
        setTimeout(() => conversation.say('Bon ok je ne suis pas infaillible, tu peux poster un bogue ici : https://github.com/fabienjuif/codemylife/issues'), 500)
        setTimeout(() => conversation.say('Au fait ! Je connais les personnes suivantes : ' + nickNames.map(nickName => '@' + nickName)), 500)
    })
})