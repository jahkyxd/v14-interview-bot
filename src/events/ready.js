import Jahky from "../Base/Jahky.Client.js";
import { ActivityType, EmbedBuilder } from "discord.js";

/**
 * @param {Jahky} client
 */

export default (client) => {
    client.on("ready", async () => {
        client.user.setPresence({
            activities: [
                {
                    name: `Jahky. ❤️ ${client.config.Guild.GuildName}`,
                    type: ActivityType.Listening,
                },
            ],
            status: "idle",
        });
    });
};
