const logger = require('ffb-logging')
const ffb = require('ffb-common')
const commando = require('discord.js-commando');

module.exports = class UserInfoCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'location',
			group: 'core',
			memberName: 'location',
			description: 'Sets your location.',
			examples: ffb.dictionary.location.forEach(x => `location ${x}`),
			guildOnly: true,
			args: [
				{
					key: 'location',
					label: 'location',
					prompt: `What is your location? <http://www.floridacountiesmap.com/counties_list.shtml> (${ffb.dictionary.location})`,
					type: 'string',
					validate: text => {
						if (ffb.dictionary.location.includes(text.toLowerCase())) return true
						else return "Please enter a valid location."
					}
				}
			]
		});
	}

	hasPermission(message) {
		if(!message.guild) return "This command must be ran on a guild.";

		if (message.member.roles.has(ffb.roles.unregistered))
			return "Please set up your profile before running commands."
		
		if (message.member.roles.has(ffb.roles.over18) == false)
			return "You are underage and cannot set your location."

		return true
	}

	async run(message, args) {
		const location = args.location.toLowerCase()
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