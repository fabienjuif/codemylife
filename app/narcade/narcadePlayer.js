const request = require('request')
const actions = require('./actions')

const slackToken = process.env.SLACK_TOKEN
const narcadeAPI = process.env.NARCADE_API || 'http://localhost:4000'

// This constant is a helper, it can be used to optimize bot reaction time when there is no match, for instance
const keywords = actions.map(a => a.keywords).flatten()

module.exports = (controller, playerName, globalsChannels) => {
    controller.hears('^[Aa]ide moi [àa] (.*) ' + playerName + '( .*)?', ['ambient', 'direct_mention', 'direct_message'], (bot, message) => {
        var channel = message.channel

        // Adding the channel in the registered channels
        globalsChannels(channel)

        // Trying to find a keyword
        var matches = message.match[1].words().intersect(keywords)

        // No matche, no chocolate
        if (matches.length === 0) {
            bot.reply(message, 'Gné ? Tu veux pas laisser ' + playerName + ' tranquille au lieu de raconter n\'importe quoi !?')
            return
        }

        // Call the slack API to know the user name
        request.get('https://slack.com/api/users.info?token=' + slackToken + '&user=' + message.user, (error, response, body) => {
            if (error) {
                bot.say({
                    channel: channel,
                    text: JSON.stringify(error)
                })

                return
            }

            // Get the user name
            var userName = JSON.parse(body).user.name

            // Some interactions
            bot.say({
                channel: channel,
                text: 'Je compose son numéro... tututu '
            })

            // Matches, we can find the action code
            var code = actions.filter(a => a.keywords.includes(matches[0]))[0].code

            // Message to send to NArcade
            var message = {
                user: userName,
                helpFrom: playerName,
                action: code
            }

            // Call the NArcade API
            request.post(narcadeAPI + '/actions', {
                    json: true,
                    body: message
                },
                (error, response, body) => {
                    if (error) {
                        bot.say({
                            channel: channel,
                            text: JSON.stringify(error)
                        })
                    }
                })
        })
    })
}