const logger = require('ffb-logging')
const ffb = require('ffb-common')
const commando = require('discord.js-commando');

module.exports = class UserInfoCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'setlocation',
			group: 'core',
			memberName: 'setlocation',
			description: 'Sets your location.',
			examples: ffb.dictionary.location.forEach(x => `setlocation ${x}`),
			guildOnly: true,
			args: [
				{
					key: 'location',
					label: 'location',
					prompt: 'What is your location?',
					type: 'string',
					validate: text => {
						if (ffb.dictionary.location.includes(text)) return true
						else return "Please enter a valid location."
					}
				}
			]
		});
	}

	async run(message, args) {
		const location = args.location
		const user = message.member
		
		if (message.member.roles.has(ffb.roles.location[location])) {
			await user.removeRole(ffb.roles.location[location])
			logger.info(`${user.displayName} removed location ${location}.`, { user: user.id, action: 'removed', location: location })
			return message.reply(`You have been removed from the '${location}' location.`)
		} else {
			await user.addRole(ffb.roles.location[location])
			logger.info(`${user.displayName} added location ${location}.`, { user: user.id, action: 'added', location: location })
			return message.reply(`You have been added to the '${location}' location.`)
		}
	}
};