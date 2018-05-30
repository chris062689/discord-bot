exports.dictionary = {
    access: [
        'nsfw',
        'hookup',
        'kink'
    ],
    relationship: [
        'single',
        'closed',
        'open'
    ],
    orientation: [
        'straight',
        'bisexual',
        'gay',
        'pansexual'
    ],
    gender: [
        'male',
        'female',
        'mtf',
        'ftm',
        'neutral',
        'other'
    ],
    location: [
        'central',
        'central-east',
        'central-west',
        'north-central',
        'north-east',
        'north-west',
        'south-east',
        'south-west'
    ]
}

exports.roles = {
    over18: '450787701940289536',
    unregistered: '450787902893326369'
}

exports.categories = {
    location: '450820612970119168'
}

exports.logMessage = (message) => {
    if (message && message.guild && message.channel)
        return {
            id: message.id,
            content: message.content,
            author: {
                id: message.author.id,
                username: message.author.username
            },
            channel: {
                id: message.channel.id,
                name: message.channel.name
            },
            guild: {
                id: message.guild.id,
                name: message.guild.name
            }
        }
    else if (message)
        return {
            id: message.id,
            content: message.content,
            author: {
                id: message.author.id,
                username: message.author.username
            }
        }
    else
        return null
}