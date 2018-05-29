const logger = require('ffb-logging')
const ffb = require('ffb-common')
const commando = require('discord.js-commando');

module.exports = class UserInfoCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'register',
			group: 'core',
			memberName: 'register',
			description: 'Registers you to the server.',
			examples: ['register 16'],
			guildOnly: true,
			args: [
				{
					key: 'age',
					label: 'age',
					prompt: 'How old are you?',
					type: 'integer'
				}
			]
		});
	}


	hasPermission(message) {
		if(!message.guild) return this.client.isOwner(message.author);

		if (message.member.roles.has(ffb.roles.unregistered)) return true
		else return "You are already registered."
	}

	async run(message, args) {
		const age = args.age
		const user = message.member

		logger.info(`${user.displayName} registered as ${age}.`, { user: user.id, age: age })

		user.removeRole(ffb.roles.unregistered)
		if (age >= 18) {
			// They are at least 18 years old.
			user.addRole(ffb.roles.over18)
		} else {
			logger.warn(`${user.displayName} is underage.`, { user: user.id, age: age })
			// They are underage.
		}

		return user.send("You are now registered. Welcome to the channel!")
	}
};