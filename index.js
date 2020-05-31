const Discord = require('discord.js');
const config = require("./config.json");
const fs = require('fs');

const client = new Discord.Client();


client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', msg => {
    
    if(!msg.author.bot){
        if(msg.content.startsWith('eld materias')){
            require("./commands/materias").execute(msg);
        }
        if(msg.content.startsWith('opa vlw mano')){
            msg.channel.send('opa mano, suave :crocodile:');
        }
        
        if(msg.content.startsWith('bo noite ae mano')){
            msg.channel.send('o mano, bo noite');
        }
    }
});


client.login(config.token);

