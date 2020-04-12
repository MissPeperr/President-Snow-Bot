const Discord = require('discord.js');
const DataManager = require('./data-manager.js')



module.exports.handlePlayers = function (message) {
    // take roles from the next message
    message.channel.send('ADD, REMOVE, or LIST Players?');
    const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
    collector.on('collect', m => {
        if (m.content.toUpperCase() == "ADD") {
            message.channel.send('Which Players should I include? Separate Players (users) by -\'s, bitch');
            collector.on('collect', m => {
                _addPlayers(m, message);
                return;
            });
        } else if (m.content.toUpperCase() == "REMOVE") {
            message.channel.send('Which Players should I remove? Separate Players (users) by -\'s, bitch');

            _listRoles(message);
            collector.on('collect', m => {
                _removePlayers(m, message);
                return;
            });
        } else if (m.content.toUpperCase() == "LIST") {
            _listPlayers(message);
        }
    })
}

// set the player as active, determine ther attributes for the game
// if they are already active and alive, be sassy
// if they died already, I guess we can let them play again, but they're weaker this time? 
function activatePlayer(message) {

        // validate that we have a player reference
        var player = message.author;

        //look them up in our player list
        DataManager.getObjByGUID("users", player.id).then(resp => {
            // determine their role (to assign power level?)
            let newPlayer = {
                name: player.username,
                GUID: player.id,
                playing: true,
                isAdmin: false,
                roleId: 0,
                health: 100,
                serverGUID: message.guild.id,
                gamesWon: 0
            }
            // modularized fetch calls; now located in data-manager.js
            DataManager.getObjByName("roles", player.username).then(resp2 => {
                if (resp2.length === 0) {
                    DataManager.post("roles", newPlayer)
                }
            });

        });

        

        // Don't give them a weapon until the game starts, we want them to choose then
}




function _addPlayers(m, message) {

}

function _removePlayers(m, message) {

}

function _listPlayers(m, message) {

}