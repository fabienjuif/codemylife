module.exports = (controller, playersName) => {
    for (playerName of playersName) {
        require('./narcadePlayer')(controller, playerName)
    }

    controller.hears('[nN][aA]rcade help', ['ambient', 'direct_mention', 'direct_message'], (bot, message) => {
        var channel = message.channel

        bot.reply(message, 'Ha ouai tu veux de l\'aide :)')
        setTimeout(() => {
            bot.say({
                channel: channel,
                text: 'C\'est bien...'
            })

            setTimeout(() => {
                bot.say({
                    channel: channel,
                    text: 'Je rigole !! :D'
                })

                bot.say({
                    channel: channel,
                    text: 'Tu devrais demander de l\'aide a une des ces personnes :' + playersName.map(p => ' ' + p)
                })

                bot.say({
                    channel: channel,
                    text: 'Poliment, par exemple comme ça : "Aide moi à détruire le mur ' + playersName[0] + '"'
                })

                bot.say({
                    channel: channel,
                    text: '(La phrase doit commencer par "Aide moi à", puis il doit y avoir un mot clé (par exemple: "détruire") et se terminer par le nom du joueur invoqué)'
                })
            }, 2000)
        }, 1000)

    })

    controller.hears('[nN][Aa]rcade', ['ambient', 'direct_mention', 'direct_message'], (bot, message) => {
      var channel = message.channel

      bot.reply(message, 'Je crois que tu cherches ce lien : http://192.168.1.29/') // TODO

      setTimeout(() => {
          bot.say({
            channel: channel,
            text: '(Tu peux aussi taper "narcade help" si tu as besoin d\'aide)'
          })
      }, 1000)
    })
}
