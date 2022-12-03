module.exports = {
    name: "clear",
    aliases: ["清除", "核武器"],
    category: "moderation",
    description: "清空聊天",
    run: async (client, message, args) => {
        if (message.deletable) {
            message.delete();
        }
    
        // Member doesn't have permissions
        if (!message.member.hasPermission("管理消息")) {
            return message.reply("你不能刪除消息....").then(m => m.delete(5000));
        }

        // Check if args[0] is a number
        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.reply("是啊……那不是數字嗎？順便說一下，我也不能刪除 0 條消息。").then(m => m.delete(5000));
        }

        // Maybe the bot can't delete messages
        if (!message.guild.me.hasPermission("管理消息")) {
            return message.reply("抱歉...我無法刪除消息。").then(m => m.delete(5000));
        }

        let deleteAmount;

        if (parseInt(args[0]) > 100) {
            deleteAmount = 100;
        } else {
            deleteAmount = parseInt(args[0]);
        }

        message.channel.bulkDelete(deleteAmount, true)
            .then(deleted => message.channel.send(`我刪除了 \`${deleted.size}\` 消息。`))
            .catch(err => message.reply(`出問題了... ${err}`));
    }
}
