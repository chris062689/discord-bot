const logger = require('ffb-logging')
const ffb = require('ffb-common')
const commando = require('discord.js-commando');

module.exports = class UserInfoCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'setorientation',
			group: 'core',
			memberName: 'setorientation',
			description: 'Sets your orientation.',
			examples: ffb.dictionary.orientation.forEach(x => `setorientation ${x}`),
			guildOnly: true,
			args: [
				{
					key: 'orientation',
					label: 'orientation',
					prompt: 'What is your orientation?',
					type: 'string',
					validate: text => {
						if (ffb.dictionary.orientation.includes(text)) return true
						else return "Please enter a valid orientation."
					}
				}
			]
		});
	}

	async run(message, args) {
		const orientation = args.orientation
		const user = message.member

		logger.info(`${user.displayName} set their orientation as ${orientation}.`, { user: user.id, orientation: orientation })

		for (var status in ffb.roles.orientation)
			await user.removeRole(ffb.roles.orientation[orientation])
		
        await user.addRole(ffb.roles.orientation[orientation])
		return message.reply(`Your orientation has been updated to '${orientation}'`)
	}
};