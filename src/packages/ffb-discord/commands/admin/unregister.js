const logger = require('ffb-logging')
const ffb = require('ffb-common')
const commando = require('discord.js-commando');

module.exports = class UserInfoCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'unregister',
			group: 'admin',
			memberName: 'unregister',
			description: 'Resets a user to the unregistered state.',
            guildOnly: true,
            ownerOnly: true,            
			args: [
				{
					key: 'user',
					label: 'User',
					prompt: 'Which user do you want to unregister?',
					type: 'member'
				}
			]
		});
    }

	async run(message, args) {
        const senderUser = message.member
        const user = args.user

        logger.info(`${senderUser.displayName} unregistered ${user.displayName}.`, { sender: senderUser.id, user: user.id })
        
        for (var x in user.roles)
            await user.removeRole(user.roles[x])
        await user.addRole(ffb.roles.unregistered)
        
        await message.reply("User has been unregistered.")
		return message.delete()
	}
};