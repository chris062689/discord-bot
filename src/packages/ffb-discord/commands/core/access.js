const logger = require('ffb-logging')
const ffb = require('ffb-common')
const commando = require('discord.js-commando');

module.exports = class UserInfoCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'access',
			group: 'core',
			memberName: 'access',
			description: 'Sets your access.',
			examples: ffb.dictionary.access.forEach(x => `access ${x}`),
			guildOnly: true,
			args: [
				{
					key: 'group',
					label: 'Channel Group',
					prompt: `What channel group access do you want to toggle? (${ffb.dictionary.access})`,
					type: 'string',
					validate: text => {
						if (ffb.dictionary.access.includes(text.toLowerCase())) return true
						else return "Please enter a valid channel group."
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
			return "You are underage and cannot access that channel."
		
		return true
	}

	async run(message, args) {
        const group = args.group.toLowerCase()
        const enabled = !message.member.roles.has(ffb.roles.access[group])
		const user = message.member

		logger.info(`${user.displayName} updated access to '${group}' to ${enabled}.`, { user: user.id, group: group, enabled: enabled })

		if (enabled) {
			await user.addRole(ffb.roles.access[group])
			await message.reply(`You now have access to the ${group} channel group.`)
		} else {
			await user.removeRole(ffb.roles.access[group])
			await message.reply(`You no longer have access to the ${group} channel group.`)
		}
		
		return message.delete()
	}
};