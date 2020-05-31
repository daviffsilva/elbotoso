module.exports = {
    name: 'Materias',
    description: 'Mostrar matérias para o usuário',
    execute: msg => {
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
}