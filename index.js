const mongoose = require('mongoose');
const discord = require('discord.js');
const stickerController = require("./controller/stickerController");
const langStrings = require("./language/language_strings");
const lang = require("./language/language");
const dc = new discord.Client();
const express = require('express');
const app = express();
const PREFIX = ".s";
require('dotenv').config()

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

mongoose.connect(process.env.HOST_NAME, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database Connection ERROR:'));


dc.login(process.env.TOKEN, console.log(`Connected`)).catch((err) => console.log(`Connection failed: ${err}`));

dc.on('ready', () => {
	console.log('Bot Ready!');
});

dc.on('message', async message => {
	if (message.content.startsWith(PREFIX)) {
		const input = message.content.slice(PREFIX.length).trim().split(' ');
		const command = input.shift();

		if (command === "add") stickerController.addSticker(message.guild.id, message.member.roles.cache, input, (err) => {
			message.channel.send(lang.useTemplate(langStrings.tr.add[err], [input[0]]))
		});
		else if (command === "remove") stickerController.removeSticker(message.guild.id, message.member.roles.cache, input, (err) => {
			message.channel.send(lang.useTemplate(langStrings.tr.remove[err], [input[0]]))
		});
		else if (command === "help"){
			message.channel.send(langStrings.tr.help[0]);
			message.channel.send(langStrings.tr.help[1]);
			message.channel.send(langStrings.tr.help[2]);
		}
		else stickerController.getSticker(message.guild.id, command, (result) => {
			if (result) message.channel.send(result.url);
			else message.channel.send(lang.useTemplate(langStrings.tr.use[0], command));
		});
	}
});

app.get("/", (req, res) => res.sendFile("./index.html"));
app.post("/sticker", (req, res) => console.log(req.body));

app.listen(process.env.PORT, () => console.log(`Sunucu ${process.env.PORT} da başladı`));