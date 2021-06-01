const GuildModel = require("../models/model_guildSticker");

exports.addSticker = async (guildId, roles, args, next) => {
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
exports.removeSticker = (guildId, roles, args, next) => {
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

exports.getSticker = (guildId, name, next) => {
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


