const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

const fetch = require("node-fetch");

module.exports = {
    name: "instagram",
    aliases: ["insta"],
    category: "info",
    description: "找出一些不錯的 Instagram 統計數據",
    usage: "<name>",
    run: async (client, message, args) => {
        const name = args.join(" ");

        if (!name) {
            return message.reply("也許實際搜索某人有用...!")
                .then(m => m.delete(5000));
        }

        const url = `https://instagram.com/${name}/?__a=1`;
        
        let res; 

        try {
            res = await fetch(url).then(url => url.json());
        } catch (e) {
            return message.reply("我找不到那個賬號... :(")
                .then(m => m.delete(5000));
        }

        const account = res.graphql.user;

        const embed = new RichEmbed()
            .setColor("RANDOM")
            .setTitle(account.full_name)
            .setURL(`https://instagram.com/${name}`)
            .setThumbnail(account.profile_pic_url_hd)
            .addField("Profile information", stripIndents`**- 用戶名:** ${account.username}
            **- 全名:** ${account.full_name}
            **- 傳:** ${account.biography.length == 0 ? "沒有任何" : account.biography}
            **- 貼文:** ${account.edge_owner_to_timeline_media.count}
            **- 追蹤者:** ${account.edge_followed_by.count}
            **- 下列的:** ${account.edge_follow.count}
            **- 私人賬戶:** ${account.is_private ? "是 🔐" : "不是 🔓"}`);

        message.channel.send(embed);
    }
}
