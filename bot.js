const Discord = require('discord.js');
const config = require('./config.json');
const DataManager = require('./data-manager.js')
const utils = require("./utils.js")
const RoleManager = require("./roles/roles.js")

// Create an instance of a Discord client
const client = new Discord.Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
    console.log('whaddup bitch!');
});

// here is where the bot does shit
// Create an event listener for messages
client.on('message', message => {
    if (message.content === 'ping') {
        message.channel.send('pong');
    }
    // Essentially start the gameplay for that person
    else if (message.content === 'I volunteer as tribute') {
        console.log(message.author)
        message.channel.send("<@" + message.author + ">,  you have been activated. Prepare your anus.");
        //utils.activatePlayer(message);
    }
    else if (message.content.toUpperCase() === "ROLE INFO") {

        RoleManager.handleRoles(message);

    } else if (message.content.toUpperCase() === "PLAYER INFO") {

        utils.handlePlayers(message);

    } else if (message.content.toUpperCase() === "HELP") {
        message.author.id === message.guild.ownerID ?
            message.channel.send("Available Commands: \`ping\`, \`role info\`, \`player info\`, \`I volunteer as tribute\`, \`help\`")
            : message.channel.send("Available Commands: \`ping\`, \`I volunteer as tribute\`, \`help\`")
    }
})



// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(config.token);