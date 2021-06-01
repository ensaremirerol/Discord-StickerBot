const mongoose = require('mongoose');

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

module.exports = GuildModel;