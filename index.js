const mongoose = require('mongoose');
const discord = require('discord.js');
const stickerController = require("./controller/stickerController");
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


app.login(process.env.TOKEN, console.log(`Connected`)).catch((err) => console.log(`Connection failed: ${err}`));

app.on('ready', () => {
	console.log('Bot Ready!');
});

app.on('message', async message => {
	if (message.content.startsWith(PREFIX)) {
		const input = message.content.slice(PREFIX.length).trim().split(' ');
		const command = input.shift();

		if (command === "add") stickerController.addSticker(message.guild.id, message.member.roles.cache, input, (err) => {
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
		else if (command === "remove") stickerController.removeSticker(message.guild.id, message.member.roles.cache, input, (err) => {
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
		else if (command === "help"){
			message.channel.send("Sticker eklemek için \".s add <AD> <Resim linki>\"");
			message.channel.send("Sticker silmek için \".s remove <AD>\"");
			message.channel.send("Sticker göndermek için \".s <AD>\"");
		}
		else stickerController.getSticker(message.guild.id, command, (result) => {
			if (result) message.channel.send(result.url);
			else message.channel.send(`"${command}" diye bir çıkartma yok!\nYardım için help komtunu kullanabilirsiniz.`)
		});
	}
});
