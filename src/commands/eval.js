import Jahky from "../Base/Jahky.Client.js";
import {
    Message,
    EmbedBuilder,
    TextChannel,
    User,
    Guild,
} from "discord.js";
import util from "util"

export default {
    name: "eval",
    aliases: ["ev"],
    owner: true,

    /**
     *
     * @param {Jahky} client
     * @param {Message} message
     * @param {Array<String>} args
     * @param {EmbedBuilder} embed
     * @param {TextChannel} channel
     * @param {User} author
     * @param {Guild} guild
     */

    async execute(client, message, args, embed, channel, author, guild) {
        if (!args[0]) return channel.send({ content: "kod belirt ocx!" });
        let code = args.join(" ");

        try {
            var result = clean(await eval(code));
            if (result.includes(client.token))
                return channel.send({
                    content:
                        "Al sana token: ``Njk2MTY4Nz8SDIFDU4OTA1MDk4.b4nug3rc3k.bir.t0k3ns4n4cak.kadarsalagim``",
                });
            channel.send({
                content: `\`\`\`js
${result}
        \`\`\``,
            });
        } catch (err) {
            channel.send({
                content: `\`\`\`js
${err}
        \`\`\``,
            });
        }
    },
};

function clean(text) {
    if (typeof text !== "string") text = util.inspect(text, { depth: 0 });
    text = text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
    return text;
}
