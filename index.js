const mongoose = require('mongoose');
const discord = require('discord.js');
const app = new discord.Client();
const PREFIX = ".s";
require('dotenv').config()

/*
* 	CALLBACK HELL MUHAHAHA
*/

mongoose.connect(process.env.HOST_NAME, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database Connection ERROR:'));

const guildSchema = new mongoose.Schema({
	guildId: {
		type: String,
		required: true
	},
	sticker: [{
		name: String,
		url: String
	}],
});

const GuildModel = mongoose.model('Guild', guildSchema);


app.login(process.env.TOKEN, console.log(`Connected`)).catch((err) => console.log(`Connection failed: ${err}`));

app.on('ready', () => {
	console.log('Bot Ready!');
});

app.on('message', async message => {
	if (message.content.startsWith(PREFIX)) {
		const input = message.content.slice(PREFIX.length).trim().split(' ');
		const command = input.shift();

		if (command === "add") await addSticker(message.guild.id, input, (err) => {
			switch (err) {
				case 0:
					message.channel.send(`"${input[0]}" adlı sticker eklendi!`);
					break;
				case 1:
					message.channel.send(`Bro sadece isim ve adres lütfen`);
					break;
				case 2:
					message.channel.send(`Sıçtım ben kaçar.`);
					break;
				case 3:
					message.channel.send(`"${input[0]}" adlı sticker zaten var!?!`);
					break;
				default:
					message.channel.send(`Bu olmamalıydı!`);
					break;
			}
		});
		else await getStickerObj(message.guild.id, command, (result) => {
			if(result) message.channel.send(result.url);
			else message.channel.send(`${command} diye bir çıkartma yok`)
		});
	}
});

const addSticker = async (guildId, args, next) => {
	if (args.length != 2) return next(1); // Argument Error
	const sticker = {
		name: args[0],
		url: args[1]
	};
	await GuildModel.findOne({
		guildId: guildId
	}, async (error, result) => {
		if (!error) {
			if (!result) result = await GuildModel.create({
				guildId: guildId
			});
			await isStickerInGuild(result.guildId, sticker.name, (fSticker) => {
				if (fSticker) {
					return next(3);
				} else {
					result.sticker.push(sticker);
					result.save();
					return next(0);
				}
			});
		} else return next(2); // Error
	});
};

const getStickerObj = async (guildId, name, next) => {
	isStickerInGuild(guildId, name, (result) => {
		if(result){
			result.sticker.forEach((e) =>{
				if(e.name === name) return next(e);
			});
		}
		else return next(undefined);
	})
}

const isStickerInGuild = async (guildId, name, next) => {
	next(await GuildModel.findOne({guildId: guildId, "sticker.name":name}));
}
