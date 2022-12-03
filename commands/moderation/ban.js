const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "ban",
    category: "moderation",
    description: "禁止會員",
    usage: "<id | 標記>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "日誌") || message.channel;

        if (message.deletable) message.delete();

        // No args
        if (!args[0]) {
            return message.reply("請提供要禁止的人。")
                .then(m => m.delete(5000));
        }

        // No reason
        if (!args[1]) {
            return message.reply("請提供禁止的理由。")
                .then(m => m.delete(5000));
        }

        // No author permissions
        if (!message.member.hasPermission("成員")) {
            return message.reply("❌ 您無權禁止成員。請聯繫其他管理員")
                .then(m => m.delete(5000));
        
        }
        // No bot permissions
        if (!message.guild.me.hasPermission("成員")) {
            return message.reply("❌ 我沒有禁止成員的權限。請聯繫管理員")
                .then(m => m.delete(5000));
        }

        const toBan = message.mentions.members.first() || message.guild.members.get(args[0]);

        // No member found
        if (!toBan) {
            return message.reply("找不到該成員，請重試")
                .then(m => m.delete(5000));
        }

        // Can't ban urself
        if (toBan.id === message.author.id) {
            return message.reply("你不能禁止自己...")
                .then(m => m.delete(5000));
        }

        // Check if the user's banable
        if (!toBan.bannable) {
            return message.reply("我想，由於角色層次的關係，我不能禁止那個人。")
                .then(m => m.delete(5000));
        }
        
        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setThumbnail(toBan.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**- 被禁會員:** ${toBan} (${toBan.id})
            **- 被禁止:** ${message.member} (${message.member.id})
            **- 原因:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor(`此驗證在 30 秒後失效。`)
            .setDescription(`你想禁止嗎 ${toBan}?`)

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reactioncollector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // Verification stuffs
            if (emoji === "✅") {
                msg.delete();

                toBan.ban(args.slice(1).join(" "))
                    .catch(err => {
                        if (err) return message.channel.send(`好吧……禁令沒有奏效。這是錯誤 ${err}`)
                    });

                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`禁令取消。`)
                    .then(m => m.delete(10000));
            }
        });
    }
};
