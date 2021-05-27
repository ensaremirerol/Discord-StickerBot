const mongoose = require('mongoose');

const stickerSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        url: {type: String, required: true}
    }
);

const guildSchema = new mongoose.Schema(
    {
        guildId: {type: String, required: true},
        stickers: [stickerSchema],
    }
);

module.exports = {
    stickerSchema,
    guildSchema,
}