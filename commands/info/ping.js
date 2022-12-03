module.exports = {
    name: "ping",
    description: "查看API延遲",
    run: async (client, message, args) => {
        const msg = await message.channel.send(`🏓 計算中....`);

        msg.edit(`🏓 Ping!
        延遲是 ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}秒
        API延遲 is ${Math.round(client.ping)}秒`);
    }
}
