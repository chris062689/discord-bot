require('checkenv').check();

const path = require('path');
const logger = require('ffb-logging');
const commando = require('discord.js-commando');
const sqlite = require('sqlite');

const ffb = require('ffb-common')

/* Initalize dictionaries in FFB common */
async function generateRoles(guild, dictionary, role) {
	ffb.roles[role] = {}
	const roleCollection = ffb.roles[role]

	dictionary.forEach(async (value, index) => {
		const roleName = `${role} - ${value.toLowerCase()}`
		var roleRef = guild.roles.find('name', roleName)
		if (roleRef == null) {
			await guild.createRole({
				name: roleName
			}, 'Automatically generated.')

			roleRef = guild.roles.find('name', roleName)
			logger.info(`Created role '${roleRef.id}' ${roleRef.name} based on ${role}/${value}.`)
		} else {
			logger.debug(`Found existing role '${roleRef.id}' ${roleRef.name} based on ${role}/${value}.`)
		}

		if (roleRef) {
			roleCollection[value] = roleRef.id
			return roleRef.id
		} else {
			return null
		}
	})
}

async function initalizeGuild(guild) {
	await generateRoles(guild, ffb.dictionary.access, 'access')
	await generateRoles(guild, ffb.dictionary.relationship, 'relationship')
	await generateRoles(guild, ffb.dictionary.orientation, 'orientation')
	await generateRoles(guild, ffb.dictionary.gender, 'gender')
	await generateRoles(guild, ffb.dictionary.location, 'location')

	ffb.dictionary.location.forEach(async (value) => {
		const channelName = `location-${value}`.toLowerCase()
		var channelRef = guild.channels.find('name', channelName)

		if (channelRef) {
			logger.debug(`Found existing channel: ${channelName}`)
		} else {
			await guild.createChannel(channelName, 'text', null, 'Automatically generated.')

			channelRef = guild.channels.find('name', channelName)
			logger.info(`Created channel '${channelRef.id}' ${channelRef.name} based on ${value}`)
		}

		if (channelRef.parentID != ffb.categories.location) {
			channelRef.setParent(ffb.categories.location)
		}

		// Reset permissions for location channels.
		channelRef.overwritePermissions(guild.roles.find('name', '@everyone'), {
			READ_MESSAGES: false,
			SEND_MESSAGES: false
		})
		channelRef.overwritePermissions(guild.roles.find('name', `location - ${value}`.toLowerCase()), {
			READ_MESSAGES: true,
			SEND_MESSAGES: true
		})
	})
}

const client = new commando.Client({
	owner: process.env.DISCORD_OWNER,
	commandPrefix: '.'
});

client
	.on('error', (x) => logger.error(x))
	.on('warn', (x) => logger.warn(x))
	.on('debug', (x) => null)
	.on('ready', async () => {
		logger.info(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);

		const guild = client.guilds.first()
		initalizeGuild(guild)
	})
	.on("guildMemberAdd", (member) => {
		const guild = member.guild;
		member.addRole(ffb.roles.unregistered)
		logger.debug(`${member} ${member.displayName} has joined the server.`)
	})
	.on('disconnect', () => {
		logger.warn('Disconnected!');
	})
	.on('reconnecting', () => {
		logger.warn('Reconnecting...');
	})
	.on('commandError', (cmd, err) => {
		if (err instanceof commando.FriendlyError) {
			return;
		}
		logger.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, { error: err, message: ffb.logMessage(cmd.message) });
	})
	.on('commandBlocked', (msg, reason) => {
		logger.warn(`Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''} blocked; ${reason}`, ffb.logMessage(msg));
	});

client.setProvider(
	sqlite.open(path.join(__dirname, 'database.sqlite3')).then(db => new commando.SQLiteProvider(db))
);

client.registry
	.registerGroup('core', 'Core Commands')
	.registerDefaults()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login(process.env.DISCORD_TOKEN);
