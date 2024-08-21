import Jahky from "../Base/Jahky.Client.js";
import {
    Message,
    EmbedBuilder,
    TextChannel,
    User,
    Guild,
} from "discord.js";

export default {
    name: "ping",
    aliases: [],

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
        channel.send({
            embeds: [
                embed.setDescription(
                    `Anlık olarak pingim \`${client.ws.ping}\` ms`
                ),
            ],
        });
    },
};
