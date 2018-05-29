const logger = require('ffb-logging')
const ffb = require('ffb-common')
const commando = require('discord.js-commando');

module.exports = class UserInfoCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'setgender',
			group: 'core',
			memberName: 'setgender',
			description: 'Sets your gender.',
			examples: ffb.dictionary.gender.forEach(x => `setgender ${x}`),
			guildOnly: true,
			args: [
				{
					key: 'gender',
					label: 'gender',
					prompt: 'What is your gender?',
					type: 'string',
					validate: text => {
						if (ffb.dictionary.gender.includes(text)) return true
						else return "Please enter a valid gender."
					}
				}
			]
		});
	}

	async run(message, args) {
		const gender = args.gender
		const user = message.member

		logger.info(`${user.displayName} set their gender as ${gender}.`, { user: user.id, gender: gender })

		for (var status in ffb.roles.gender)
			await user.removeRole(ffb.roles.gender[gender])
		
        await user.addRole(ffb.roles.gender[gender])
		return message.reply(`Your gender has been updated to '${gender}'`)
	}
};