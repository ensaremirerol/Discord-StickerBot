const mongoose = require('mongoose');
const discord = require('discord.js');
const app = new discord.Client();
const PREFIX = ".s";
const STICKER_ROLE = "Sticker Master";
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

		if (command === "add") await addSticker(message.guild.id, message.member.roles.cache, input, (err) => {
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
				case 4:
					message.channel.send(`Attığın link resim değil ki?`);
					break;
				case 5:
					message.channel.send(`Sticker düzenlemek için "${STICKER_ROLE}" adlı role ihtiyacın var`);
					break;
				default:
					message.channel.send(`Bu olmamalıydı!`);
					break;
			}
		});
		else if (command === "remove") removeSticker(message.guild.id, message.member.roles.cache, input, (err) => {
			switch (err) {
				case 0:
					message.channel.send(`"${input[0]}" adlı sticker silindi!`);
					break;
				case 1:
					message.channel.send(`Bro sadece isim lütfen`);
					break;
				case 2:
					message.channel.send(`"${input[0]}" adlı sticker yok!?!`);
					break;
				case 5:
					message.channel.send(`Sticker düzenlemek için "${STICKER_ROLE}" adlı role ihtiyacın var`);
					break;
				default:
					message.channel.send(`Bu olmamalıydı!`);
					break;
			}
		});
		else await getStickerObj(message.guild.id, command, (result) => {
			if (result) message.channel.send(result.url);
			else message.channel.send(`"${command}" diye bir çıkartma yok`)
		});
	}
});

const removeSticker = (guildId, roles, args, next) => {
	if (roles.find(role => role.name === STICKER_ROLE)) {
		if (args.length != 1) return next(1);
		isStickerInGuild(guildId, args[0], (result) => {
			if (result) {
				for (let index = 0; index < result.sticker.length; index++) {
					if (result.sticker[index].name === args[0]) {
						result.sticker.splice(index, 1);
						result.save();
						return next(0);
					}
				}
			} else return next(2);
		});
	} else return next(5);

}

const addSticker = async (guildId, roles, args, next) => {
	if (roles.find(role => role.name === STICKER_ROLE)) {
		if (args.length != 2) return next(1); // Argument Error
		if (!isImgLink(args[1])) return next(4)
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
	} else next(5);

};

const getStickerObj = async (guildId, name, next) => {
	isStickerInGuild(guildId, name, (result) => {
		if (result) {
			next(result.sticker.find((e) => e.name === name));
		} else return next(undefined);
	})
}

const isStickerInGuild = async (guildId, name, next) => {
	next(await GuildModel.findOne({
		guildId: guildId,
		"sticker.name": name
	}));
}

function isImgLink(url) {
	if (typeof url !== 'string') return false;
	return (url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi) != null);
}