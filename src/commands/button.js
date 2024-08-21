import Jahky from "../Base/Jahky.Client.js";
import {
  Message,
  EmbedBuilder,
  TextChannel,
  User,
  Guild,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  name: "button",
  aliases: [],
//   owner: true,

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
    message.delete()
    const InterviewEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${client.config.Guild.GuildName} Yetkili Başvuru Formu`,
      })
      .setColor("Random")
      .setFooter({
        text: `Made With Jahky.`,
        iconURL: client.users.cache
          .get("618444525727383592")
          .avatarURL({ dynamic: true, size: 2048 }),
      })
      .setThumbnail(message.guild.iconURL())
      .setDescription(
        `Sen de **${client.config.Guild.GuildName}** sunucumuzda yetkili olup bizlere katkıda bulunmak istiyorsan aşağıda ki butona tıklayıp çıkan formu doldurabilirsin.`
      );

    const button = new ButtonBuilder()
      .setCustomId("button")
      .setLabel("Başvurmak için tıkla!")
      .setEmoji("📩")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    channel.send({ embeds: [InterviewEmbed], components: [row] });
  },
};
