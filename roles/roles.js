const Discord = require('discord.js');
const DataManager = require('../data-manager.js')

module.exports.handleRoles = function (message) {
    // take roles from the next message
    message.channel.send(`${message.author.username}, what would you like to do?`);
    var commandList = `▫\`Set Admin 👑 \`\n▫\`Add ➕\`\n▫\`Remove ➖\`\n▫\`List 📃\``;
    message.channel.send(commandList);
    const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 15000 });
    collector.on('collect', m => {
        if (m.content.toUpperCase() == "ADD") {
            message.channel.send('Which Districts should I include? Separate Districts (roles) by -\'s, bitch');
            collector.on('collect', m => {
                _addRoles(m, message);
                return;
            });
        } else if (m.content.toUpperCase() == "REMOVE") {
            message.channel.send('Which Districts should I remove? Separate Districts (roles) by -\'s, bitch');

            _listRoles(message);
            collector.on('collect', m => {
                _removeRoles(m, message);
                return;
            });
        } else if (m.content.toUpperCase() == "LIST") {
            _listRoles(message);
        } else if (m.content.toUpperCase() === "SET ADMIN") {
            // only owner of server can use "set admin"
            if (m.author.id === message.guild.ownerID) {
                message.channel.send("Who would you like to set as an admin of the game?"),
                    collector.on('collect', reply => {
                        _setAdmin(reply, message)
                    })
            } else {
                message.channel.send("You don't have permission to do that, pleb.")
            }
        }
    })
}

function _addRoles(m, message) {

    let rolesArray = m.content.split("-");
    // trim and upperCase roles from user input and store in new Array
    const trimmedRoles = rolesArray.map(role => role.toUpperCase().trim())

    // retrieve the server's roles 
    message.guild.roles.fetch().then(resp => {
        // push each role from the user's server into new array
        resp.cache.forEach(function (Role) {
            if (trimmedRoles.includes(Role.name.toString().toUpperCase().trim())) {
                console.log("role in list: ", Role.name)
                //write to JSON
                // if user's role exists, then send to JSON
                console.log(message.guild.id)
                let newRole = {
                    name: Role.name,
                    serverGUID: message.guild.id,
                    GUID: Role.id
                }
                // modularized fetch calls; now located in data-manager.js
                DataManager.getObjByName("roles", newRole.name).then(resp => {
                    if (resp.length === 0) {
                        DataManager.post("roles", newRole)
                    }
                });
            }
        });
        return;
    })
}

// deletes existing roles from our list
// receives m as the collector (message response) result
// and message as the message object we can use to refer to our server and stuff
function _removeRoles(m, message) {
    let rolesArray = m.content.split("-");
    console.log("Seeing ", rolesArray);
    // trim and upperCase roles from user input and store in new Array
    const trimmedRoles = rolesArray.map(role => role.toUpperCase().trim())

    // retrieve the server's roles 
    message.guild.roles.fetch().then(resp => {
        // push each role from the user's server into new array
        resp.cache.forEach(function (Role) {
            //console.log("looking at ", Role)
            if (trimmedRoles.includes(Role.name.toString().toUpperCase().trim())) {
                DataManager.delete("roles", Role);
                console.log("deleted ", Role.name)
            }
            return
        });
    })
}

function _listRoles(message) {
    DataManager.get("roles").then(resp => {
        let buildMeUpDaddy = "Districts currently in play: "
        resp.forEach(function (role, index) {
            buildMeUpDaddy += `_${role.name}_ `
            if (resp[index + 1]) {
                buildMeUpDaddy += " ⚒ ";
            }
        })
        message.channel.send(buildMeUpDaddy)
    });
}

function _setAdmin(reply, message) {
    // usersMentioned is a Map
    const usersMentioned = reply.mentions.users
    if (usersMentioned !== null && usersMentioned.length !== 0) {
        for (let userObj of usersMentioned.values()) {
            // create our own user object to send to JSON
            const newUser = {
                username: userObj.username,
                GUID: userObj.id,
                playing: false,
                isAdmin: true,
                alive: true,
                health: 100,
                roleId: 0,
                serverGUID: message.guild.id,
                gamesWon: 0
            }
            // check if user is already in JSON
            DataManager.getObjByGUID("users", userObj).then(resp => {
                if (resp.length === 0) {
                    DataManager.post("users", newUser)
                } else {
                    // if user is already in JSON, make them admin
                    resp.forEach(user => {
                        user.isAdmin = true
                        DataManager.put("users", user)
                    })
                }
            });
        }
    } else {
        message.channel.send("Invalid user")
    }
}