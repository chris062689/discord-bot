const logger = require('ffb-logging')
const ffb = require('ffb-common')
const commando = require('discord.js-commando');

module.exports = class UserInfoCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'setsexuality',
			group: 'core',
			memberName: 'setsexuality',
			description: 'Sets your sexuality.',
			examples: ffb.dictionary.sexuality.forEach(x => `setsexuality ${x}`),
			guildOnly: true,
			args: [
				{
					key: 'sexuality',
					label: 'Sexuality',
					prompt: 'What is your sexuality?',
					type: 'string',
					validate: text => {
						if (ffb.dictionary.sexuality.includes(text)) return true
						else return "Please enter a valid sexuality."
					}
				}
			]
		});
	}

	async run(message, args) {
		const sexuality = args.sexuality
		const user = message.member

		logger.info(`${user.displayName} set their sexuality as ${sexuality}.`, { user: user.id, sexuality: sexuality })

		for (var status in ffb.roles.sexuality)
			await user.removeRole(ffb.roles.sexuality[sexuality])
		
        await user.addRole(ffb.roles.sexuality[sexuality])
		return message.reply(`Your sexuality has been updated to '${sexuality}'`)
	}
};