import Jahky from "../Base/Jahky.Client.js";
import { EmbedBuilder } from "discord.js";
import config from "../../config.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
    client.on("messageCreate", async (message) => {
        const prefix = config.bot.prefix.find((x) =>
            message.content.toLowerCase().startsWith(x)
        );

        if (!prefix || message.author.bot || !message.guild) return;
        const args = message.content.slice(1).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();
        const command =
            client.commands.get(commandName) ||
            client.commands.get(client.aliases.get(commandName));
        const owner = client.users.cache.get("618444525727383592");
        const author = message.author;
        const channel = message.channel;
        const guild = message.guild;
        const embed = new EmbedBuilder()
            .setColor(message.member.displayHexColor)
            .setAuthor({
                name: message.member.displayName,
                iconURL: message.member.displayAvatarURL({
                    dynamic: true,
                    size: 2048,
                }),
            })
            .setFooter({
                text: "Developed By Jahky.",
                iconURL: owner.avatarURL({ dynamic: true, size: 2048 }),
            });
        if (command) {
            if (command.owner && !config.bot.owners.includes(author.id)) return
            command.execute(
                client,
                message,
                args,
                embed,
                channel,
                author,
                guild,
                prefix
            );
        }
    });
};
