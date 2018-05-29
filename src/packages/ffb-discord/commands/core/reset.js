const logger = require('ffb-logging')
const ffb = require('ffb-common')
const commando = require('discord.js-commando');

module.exports = class UserInfoCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'reset',
			group: 'core',
			memberName: 'reset',
			description: '*DANGER* Wipes the server clean.',
            guildOnly: true,
            ownerOnly: true
		});
	}

	async run(message, args) {
        const guild = message.guild
		const user = message.member

		logger.info(`${user.displayName} is wiping the server.`)
		
        guild.roles.forEach(async (role) => {
            if (role.name.startsWith('location -')) {
                role.delete()
            }
		})
		
		guild.channels.forEach(async (channel) => {
			if (channel.name.startsWith('location-')) {
				channel.delete()
			}
		})

		return message.reply("DONE.")
	}
};