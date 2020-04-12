const Discord = require('discord.js');
const config = require('./config.json');
const DataManager = require('./data-manager.js')

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
        message.author.send("Message, bitch");
    }
    else if (message.content.toUpperCase().includes("SET ROLES")) {

        // take roles from the next message
        message.channel.send('Which Districts should I include? Separate Disctricts (roles) by -\'s, bitch');
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
        collector.on('collect', m => {
            let rolesArray = m.content.split("-");
            // trim and upperCase roles from user input and store in new Array
            const trimmedRoles = rolesArray.map(role => role.toUpperCase().trim())
            let rolesFromServer = [];
            // retrieve the server's roles 
            message.guild.roles.fetch().then(resp => {
                // push each role from the user's server into new array
                resp.cache.forEach(function (Role) {
                    rolesFromServer.push(Role.name.toString().toUpperCase().trim());
                });
            }).then(() => {
                // check to see if role that user inputs exists in their server
                for (let role of trimmedRoles) {
                    if (rolesFromServer.includes(role)) {
                        //write to JSON
                        // if user's role exists, then send to JSON
                        let newRole = {
                            name: role,
                            serverId: 1
                        }
                        // modularized fetch calls; now located in data-manager.js
                        DataManager.post("roles", newRole)
                    }
                }
            })

        })

    }
})

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(config.token);