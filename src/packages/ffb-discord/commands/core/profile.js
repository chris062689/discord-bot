const logger = require('ffb-logging')
const ffb = require('ffb-common')
const commando = require('discord.js-commando');

module.exports = class UserInfoCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'profile',
			group: 'core',
			memberName: 'register',
			description: 'Change or update your profile.',
			examples: ['profile'],
			args: [
				{
                    key: 'age', label: 'Age',
                    prompt: 'How old are you?', type: 'integer'
                },
                {
                    key: 'gender',
                    label: 'Gender',
                    prompt: `What is your gender? (${ffb.dictionary.gender})`,
                    type: 'string',
                    validate: text => {
						if (ffb.dictionary.gender.includes(text.toLowerCase())) return true
						else return "Please enter a valid gender."
					}
                },
				{
					key: 'orientation',
					label: 'Orientation',
					prompt: `What is your sexual orientation? (${ffb.dictionary.orientation})`,
					type: 'string',
					validate: text => {
						if (ffb.dictionary.orientation.includes(text.toLowerCase())) return true
						else return "Please enter a valid sexual orientation."
					}
                },
                {
					key: 'relationship',
					label: 'Relationship Status',
					prompt: `What is your relationship status? (${ffb.dictionary.relationship})`,
					type: 'string',
					validate: text => {
						if (ffb.dictionary.relationship.includes(text.toLowerCase())) return true
						else return "Please enter a valid relationship status."
					}
				}
			]
		});
    }
    
    hasPermission(message) {
        if (message.guild) return "Please run this command via direct message to set up your profile.";
        else return true
	}

	async run(message, args) {
        const profile = {
            age: args.age,
            gender: args.gender.toLowerCase(),
            orientation: args.orientation.toLowerCase(),
            relationship: args.relationship.toLowerCase()
        }

        const guild = this.client.guilds.first()
        const member = await guild.fetchMember(message.author)

        const isUnregistered = member.roles.has(ffb.roles.unregistered)
        
        // Once they have filled out their profile they are no longer unregistered.
        member.removeRole(ffb.roles.unregistered)
        
		if (profile.age >= 18 && isUnregistered == true) {
            // They are at least 18 years old.

            // This is the first time they are setting up their profile.
            // If this is not the first time, don't let them 'update'
            // their age to gain access to over 18 channels.

            // A moderator will manually have to verify they are 18
            // if they specify they are over 18 when setting up their profile.
            member.addRole(ffb.roles.over18)
        }
        
        if (profile.age < 18) {
            // They are considered underage and are blocked from specific commands.
            logger.warn(`${member.displayName} is underage.`, { user: member.id, age: profile.age })
        }
        
        // Gender
        for (var x in ffb.roles.gender)
            await member.removeRole(ffb.roles.gender[x])
        await member.addRole(ffb.roles.gender[profile.gender])

        // Orientation
		for (var x in ffb.roles.orientation)
			await member.removeRole(ffb.roles.orientation[x])
        await member.addRole(ffb.roles.orientation[profile.orientation])

        // Relationship Status
		for (var x in ffb.roles.relationship)
			await member.removeRole(ffb.roles.relationship[x])
        await member.addRole(ffb.roles.relationship[profile.relationship])
        
        logger.info(`${member.displayName} updated their profile as a ${profile.age} year old, ${profile.relationship} ${profile.orientation} ${profile.gender}.`, { user: member.id, profile: profile })
        await message.reply('Your profile has been updated.')

        if (isUnregistered) {
            await message.reply('Welcome to the server! You can also use the commands `.access` and `.location` to gain access to special channels within the server.')
        }
	}
};