const logger = require('ffb-logging')
const ffb = require('ffb-common')
const commando = require('discord.js-commando');

module.exports = class UserInfoCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'setaccess',
			group: 'core',
			memberName: 'setaccess',
			description: 'Sets your access.',
			examples: ffb.dictionary.access.forEach(x => `setaccess ${x}`),
			guildOnly: true,
			args: [
				{
					key: 'group',
					label: 'Channel Group',
					prompt: 'What channel group do you want to toggle?',
					type: 'string',
					validate: text => {
						if (ffb.dictionary.access.includes(text)) return true
						else return "Please enter a valid channel group."
					}
				}
			]
		});
    }
    
	hasPermission(message) {
		if(!message.guild) return this.client.isOwner(message.author);

		if (message.member.roles.has(ffb.roles.over18)) return true
		else return "You are underage and cannot access that channel."
	}

	async run(message, args) {
        const group = args.group
        const enabled = !message.member.roles.has(ffb.roles.access[group])
		const user = message.member

		logger.info(`${user.displayName} updated access to '${group}' to ${enabled}.`, { user: user.id, group: group, enabled: enabled })

		if (enabled)
			return await user.addRole(ffb.roles.access[group])
		else
            return await user.removeRole(ffb.roles.access[group])
	}
};