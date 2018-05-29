const winston = require('winston');

const logger = new winston.Logger({
	level: 'info',
	transports: [
		new winston.transports.File({ filename: './logs/plaintext.log', timestamp: true }),
		new winston.transports.Console({ level: 'debug', prettyPrint: true, timestamp: true, colorize: true })
	],
	handleExceptions: true,
	humanReadableUnhandledException: true,
	exitOnError: true,
	meta: true
});

module.exports = logger;
