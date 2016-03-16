const request = require('request')

const actions = [{
    code: 'destroy',
    keywords: ['destroy', 'détruire', 'detruire', 'casser']
}, {
    code: 'up',
    keywords: ['up', 'soulever', 'monter']
}, {
    code: 'down',
    keywords: ['down', 'rabaisser', 'descendre']
}, {
    code: 'fix',
    keywords: ['fix', 'réparer', 'reparer', 'rafistoler']
}]

// This constant is a helper, it can be used to optimize bot reaction time when there is no match, for instance
const keywords = actions.map(a => a.keywords).flatten()

module.exports = (controller, playerName) => {
    controller.hears('^[Aa]ide moi [àa] (.*) ' + playerName + '( .*)?', ['ambient', 'direct_mention', 'direct_message'], (bot, message) => {
        var channel = message.channel



        // Trying to find a keyword
        var matches = message.match[1].words().intersect(keywords)

        // No matches, no chocolate
        if (matches.length === 0) {
            bot.reply(message, 'Gné ? Tu veux pas laisser ' + playerName + ' tranquille au lieu de raconter n\'importe quoi !?')
            return
        }
        bot.reply(message, 'Je compose son numéro... tututu ')

        // Matches, we can find the action code
        var code = actions.filter(a => a.keywords.includes(matches[0]))[0].code

        // Message to send to NArcade
        var message = {
            playerName: playerName,
            action: code
        }

        request.post('http://localhost:4000/actions', {
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
}