const logger = require('ffb-logging')
const ffb = require('ffb-common')
const commando = require('discord.js-commando');

module.exports = class UserInfoCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'setrelationship',
			group: 'core',
			memberName: 'setrelationship',
			description: 'Sets your relationship status.',
			examples: ffb.dictionary.relationship.forEach(x => `setrelationship ${x}`),
			guildOnly: true,
			args: [
				{
					key: 'relationship',
					label: 'Relationship Status',
					prompt: 'What is your relationship status?',
					type: 'string',
					validate: text => {
						if (ffb.dictionary.relationship.includes(text)) return true
						else return "Please enter a valid relationship status."
					}
				}
			]
		});
	}

	async run(message, args) {
		const relationship = args.relationship
		const user = message.member

		logger.info(`${user.displayName} set their relationship status as ${relationship}.`, { user: user.id, relationship: relationship })

		for (var status in ffb.roles.relationship)
			await user.removeRole(ffb.roles.relationship[status])
		
		await user.addRole(ffb.roles.relationship[relationship])
		
		return message.reply(`Your relationship status has been updated to '${relationship}'`)
	}
};