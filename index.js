const mongoose = require('mongoose');
const discord = require('discord.js');
const app = new discord.Client();
const {guildSchema, stickerSchema} = require("./models");
const PREFIX = ".s";
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const GuildModel = mongoose.model('Guild', guildSchema);

app.on('ready', () => {
    console.log('Bot Ready!');
});

app.on('message', async message => {
	if (message.content.startsWith(PREFIX)) {
		const input = message.content.slice(PREFIX.length).trim().split(' ');
		const command = input.shift();
		const commandArgs = input.join(' ');

		message.channel.send(command);
	}
});

app.login(process.env.TOKEN, console.log(`Connected`)).catch((err) => console.log(process.env.TOKEN));