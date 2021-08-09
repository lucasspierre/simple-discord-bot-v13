require('dotenv').config()
const Discord = require("discord.js");
const fs = require('fs')
const { Client, Intents } = require('discord.js')
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES
    ]
})

fs.readdir("./src/events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        const event = require(`./src/events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./src/events/${file}`)];
    });
});

client.commands = new Discord.Collection();
fs.readdir("./src/commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./src/commands/${file}`);
        let commandName = file.split(".")[0];
        console.log(`Carregando comando: ${commandName}`);
        client.commands.set(commandName, props);
    });
});

client.login(process.env.BOT_TOKEN);