const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, formatDate } = require("../../functions.js");

module.exports = {
    name: "whois",
    aliases: ["誰", "用戶", "信息"],
    description: "返回用戶信息",
    usage: "[用戶名 | id | 標記]",
    run: (client, message, args) => {
        const member = getMember(message, args.join(" "));

        // Member variables
        const joined = formatDate(member.joinedAt);
        const roles = member.roles
            .filter(r => r.id !== message.guild.id)
            .map(r => r).join(", ") || '沒有任何';

        // User variables
        const created = formatDate(member.user.createdAt);

        const embed = new RichEmbed()
            .setFooter(member.displayName, member.user.displayAvatarURL)
            .setThumbnail(member.user.displayAvatarURL)
            .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)

            .addField('Member information:', stripIndents`**- 顯示名稱:** ${member.displayName}
            **- 加入於:** ${joined}
            **- 角色:** ${roles}`, true)

            .addField('用戶信息:', stripIndents`**- ID:** ${member.user.id}
            **- 用戶名**: ${member.user.username}
            **- 標籤**: ${member.user.tag}
            **- 創建於**: ${created}`, true)
            
            .setTimestamp()

        if (member.user.presence.game) 
            embed.addField('正在播放', stripIndents`** 名稱:** ${member.user.presence.game.name}`);

        message.channel.send(embed);
    }
}
