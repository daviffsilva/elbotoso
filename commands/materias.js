const googleconn = require('../google');
const Discord = require('discord.js');

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
let courses;


module.exports = {
    name: 'Materias',
    description: 'Mostrar matérias para o usuário',
    execute: msg => {
        msg.channel.send("podipá mano perae to pegando aq")
        .then(m => {
            msg.channel.startTyping();
            googleconn.getCourses()
            .then(c =>{
                m.delete({timeout: 500});
                m = null;
                courses = c;
                let embed = new Discord.MessageEmbed();
                embed.setColor('#ff00ff');
                embed.setTitle('Matérias');
                //embed.setURL('https://discord.com/');
                c.forEach((v,k) => {
                    embed.addField(v.name, reactions[k], false);
                });
                embed.setFooter('Mensagem será apagada em 1 minuto');
                
                msg.channel.send(embed)
                .then((m) => {
                    m.delete({timeout: 60000});
                    m.awaitReactions(filterReaction, {max: 1, time: 60000, errors: []}).then(handleReactions).catch(console.error);
                    c.forEach(async (_,k)=>{
                        await m.react(reactions[k]);
                    });
                    
                }).catch(console.error);
                msg.channel.stopTyping();
            });
        });
        
    }
}