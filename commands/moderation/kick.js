const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "kick",
    category: "moderation",
    description: "踢成員",
    usage: "<id |標記 >",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "logs") || message.channel;

        if (message.deletable) message.delete();

        // No args
        if (!args[0]) {
            return message.reply("請提供一個人來踢。")
                .then(m => m.delete(5000));
        }

        // No reason
        if (!args[1]) {
            return message.reply("請提供理由。")
                .then(m => m.delete(5000));
        }

        // No author permissions
        if (!message.member.hasPermission("踢會員")) {
            return message.reply("❌ 您沒有踢出成員的權限。")
                .then(m => m.delete(5000));
        }

        // No bot permissions
        if (!message.guild.me.hasPermission("踢會員")) {
            return message.reply("❌ 我沒有踢成員的權限。")
                .then(m => m.delete(5000));
        }

        const toKick = message.mentions.members.first() || message.guild.members.get(args[0]);

        // No member found
        if (!toKick) {
            return message.reply("找不到該成員，請重試")
                .then(m => m.delete(5000));
        }

        // Can't kick urself
        if (toKick.id === message.author.id) {
            return message.reply("你不能踢自己...")
                .then(m => m.delete(5000));
        }

        // Check if the user's kickable
        if (!toKick.kickable) {
            return message.reply("我想，由於角色等級，我不能踢那個人。")
                .then(m => m.delete(5000));
        }
                
        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setThumbnail(toKick.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**- 被踢成員:** ${toKick} (${toKick.id})
            **- 被踢:** ${message.member} (${message.member.id})
            **- 原因:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor(`此驗證在 30 秒後失效。`)
            .setDescription(`你想踢嗎 ${toKick}?`)

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reaction collector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // The verification stuffs
            if (emoji === "✅") {
                msg.delete();

                toKick.kick(args.slice(1).join(" "))
                    .catch(err => {
                        if (err) return message.channel.send(`好吧……踢沒有成功。這是錯誤 ${err}`)
                    });

                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`取消踢.`)
                    .then(m => m.delete(10000));
            }
        });
    }
};
