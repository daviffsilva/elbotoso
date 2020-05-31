const googleconn = require('./google');
const Discord = require('discord.js');
const config = require("./config.json");


const client = new Discord.Client();
const reactions = [
    '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🐊', '🐢', '🦖', '🐍'
];
const filterReaction = (react, user) => {
    return reactions.includes(react.emoji.name) && !user.bot;
};
const wrkFilter = (wrk => {
    if(!wrk.dueDate){
        return false;
    }
    return new Date(wrk.dueDate.year, wrk.dueDate.month - 1, wrk.dueDate.day) > Date.now();
});

let courses;

let handleReactions = (coll) => {
    
    const reaction = coll.first();
    if(!reaction){
        return false;
    }

    const channel = reaction.message.channel;
    const course = courses[reactions.indexOf(reaction.emoji.name)];
    reaction.message.awaitReactions(filterReaction, {max: 1, time: 60000, errors: []}).then(handleReactions).catch(console.error);
    channel.send("blz mano, " + course.name + " né? perae").then((m)=>{
        channel.startTyping();
        googleconn.getWorkByCourseId(course.id).then((wrk) => {
            m.delete();
            wrk = wrk ? wrk.filter(wrkFilter) : [];
            if(wrk.length < 1){
                channel.send("tem nd pra isso n fi").then(m => {m.delete({timeout: 5000})});
                return false;
            }
            let embed = new Discord.MessageEmbed();
            let name = course.name;
            embed.setColor('#ff00ff');
            embed.setTitle('Atividades de: ' + name);
            embed.setURL(course.alternateLink);
            wrk.forEach((v,k) => {
                let title = v.title;
                embed.addField(name, title);
                //msg2 += v.title + ', ';
            });
            embed.setFooter('Kopyheirst do batatovsk', 'https://cdn.discordapp.com/avatars/346063183703834627/f7c7809aa9aca445e422464a5005c85c.png?size=128');
            
            
            channel.send(embed);
            
            
        }).catch(err => {
            m.delete();
            
            channel.send('ih irmão, deu ruim aq, manda issaq pro batata: `' + err + '`').catch(console.log);
        });
        channel.stopTyping();
    });
}


client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', msg => {
    //let reaction = reactions[(Math.random()*(reactions.length - 1)).toFixed()];

    if(!msg.author.bot){
        if(msg.content.startsWith('eld materias')){
            msg.channel.send("podipá mano perae to pegando aq").then(m => {m.delete({timeout: 10000})});
            msg.channel.startTyping();
            googleconn.getCourses()
            .then(c =>{
                courses = c;
                let embed = new Discord.MessageEmbed();
                embed.setColor('#ff00ff');
                embed.setTitle('Matérias');
                //embed.setURL('https://discord.com/');
                c.forEach((v,k) => {
                    embed.addField(v.name, reactions[k], false);
                });
                
                
                msg.channel.send(embed)
                .then((m) => {
                    m.awaitReactions(filterReaction, {max: 1, time: 60000, errors: []}).then(handleReactions).catch(console.error);
                    c.forEach(async (_,k)=>{
                        await m.react(reactions[k]);
                    });
                    
                }).catch(console.error);
                msg.channel.stopTyping();
            });


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

