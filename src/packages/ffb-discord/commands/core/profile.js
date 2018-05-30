const logger = require('ffb-logging')
const ffb = require('ffb-common')
const commando = require('discord.js-commando');

function prompt(message, dictionary) {
    return `${message} (${dictionary})`
}

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
                    prompt: prompt('What is your gender?', ffb.dictionary.gender),
                    type: string,
                    validate: text => {
						if (ffb.dictionary.gender.includes(text.toLowerCase())) return true
						else return "Please enter a valid gender."
					}
                },
				{
					key: 'orientation',
					label: 'Orientation',
					prompt: prompt('What is your sexual orientation?', ffb.dictionary.orientation),
					type: 'string',
					validate: text => {
						if (ffb.dictionary.orientation.includes(text.toLowerCase())) return true
						else return "Please enter a valid sexual orientation."
					}
                },
                {
					key: 'relationship',
					label: 'Relationship Status',
					prompt: prompt('What is your relationship status?', ffb.dictionary.relationship),
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

        const user = message.member
        const isUnregistered = message.member.roles.has(ffb.roles.unregistered)
        
        // Once they have filled out their profile they are no longer unregistered.
        user.removeRole(ffb.roles.unregistered)
        
		if (age >= 18 && isUnregistered == true) {
            // They are at least 18 years old.

            // This is the first time they are setting up their profile.
            // If this is not the first time, don't let them 'update'
            // their age to gain access to over 18 channels.

            // A moderator will manually have to verify they are 18
            // if they specify they are over 18 when setting up their profile.
            user.addRole(ffb.roles.over18)
        }
        
        if (age < 18) {
            // They are considered underage and are blocked from specific commands.
            logger.warn(`${user.displayName} is underage.`, { user: user.id, age: age })
        }
        
        // Gender
        for (var x in ffb.roles.gender)
            await user.removeRole(ffb.roles.gender[x])
        await user.addRole(ffb.roles.gender[profile.gender])

        // Orientation
		for (var x in ffb.roles.orientation)
			await user.removeRole(ffb.roles.orientation[x])
        await user.addRole(ffb.roles.orientation[profile.orientation])

        // Relationship Status
		for (var x in ffb.roles.relationship)
			await user.removeRole(ffb.roles.relationship[x])
        await user.addRole(ffb.roles.relationship[profile.relationship])
        
        logger.info(`${user.displayName} updated their profile as a ${profile.age} year old,  ${profile.relationship} ${profile.orientation} ${profile.gender}.`, { user: user.id, profile: profile })
        await user.reply('You have updated your profile.')

		return message.delete()
	}
};