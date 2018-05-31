const logger = require('ffb-logging')
const ffb = require('ffb-common')
const commando = require('discord.js-commando');

module.exports = class UserInfoCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'echo',
			group: 'admin',
			memberName: 'echo',
			description: 'Makes the bot echo.',
            guildOnly: true,
            ownerOnly: true,
			args: [
				{
					key: 'echo',
					label: 'Message',
					prompt: `What message do you want to echo?`,
					type: 'string'
				}
			]
		});
	}

	async run(message, args) {
		const echo = `${args.echo}`
        await message.channel.send(echo)
        return message.delete()
	}
};