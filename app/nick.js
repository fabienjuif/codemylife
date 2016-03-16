module.exports = (controller, nickName) => {
    controller.hears('^' + nickName + '( ?[a-z]*)', ['ambient', 'direct_mention', 'direct_message'], (bot, message) => {
        bot.reply(message, 'Salut ' + message.match[1])
    })
}