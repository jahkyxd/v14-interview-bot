import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import config from "../../config.js";
import Jahky from "../Base/Jahky.Client.js";
import moment from "moment";
moment.locale("tr");

/**
 * @param {Jahky} client
 */

export default (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId === "button") {
        if (
          config.interview.staffRole.some((x) =>
            interaction.member.roles.cache.has(x)
          )
        )
          return interaction.reply({
            content: "Zaten sunucumuzun yetkililerindensin!",
            ephemeral: true,
          });

        if (client.db.get("interview").includes(interaction.member.id))
          return interaction.reply({
            content:
              "Zaten başvurun bulunmakta! Lütfen yetkililerimizin işlem yapmasını bekle",
            ephemeral: true,
          });

        const name = new TextInputBuilder()
          .setCustomId("name")
          .setLabel("İsminiz?")
          .setPlaceholder("Kişisel isminizi giriniz")
          .setMaxLength(16)
          .setRequired(true)
          .setStyle(TextInputStyle.Short);

        const age = new TextInputBuilder()
          .setCustomId("age")
          .setLabel("Yaşınız?")
          .setMaxLength(2)
          .setPlaceholder("Yaşınız")
          .setRequired(true)
          .setStyle(TextInputStyle.Short);

        const activity = new TextInputBuilder()
          .setCustomId("activity")
          .setLabel("Aktiflik?")
          .setMaxLength(2)
          .setPlaceholder("Günlük kaç saat aktifsiniz")
          .setRequired(true)
          .setStyle(TextInputStyle.Short);

        const invite = new TextInputBuilder()
          .setCustomId("invite")
          .setLabel("Davet?")
          .setMaxLength(2)
          .setPlaceholder("Günlük kaç davet yapabilirsiniz")
          .setRequired(true)
          .setStyle(TextInputStyle.Short);

        const row1 = new ActionRowBuilder().addComponents(name);
        const row2 = new ActionRowBuilder().addComponents(age);
        const row3 = new ActionRowBuilder().addComponents(activity);
        const row4 = new ActionRowBuilder().addComponents(invite);

        const modal = new ModalBuilder()
          .setTitle("Yetkili başvuru formu")
          .setCustomId("modal");

        modal.addComponents(row1, row2, row3, row4);

        await interaction.showModal(modal);
      }

      if (interaction.customId === "approved") {
        if (
          config.interview.buttonStaff.some(
            (x) => !interaction.member.roles.cache.has(x)
          )
        )
          return;
        const messageID = interaction.message.id;

        const data = client.db.get(`messages_${messageID}`);

        const approved = new ButtonBuilder()
          .setCustomId("approved")
          .setLabel("Onayla!")
          .setStyle(ButtonStyle.Success)
          .setDisabled(true);

        const denied = new ButtonBuilder()
          .setCustomId("denied")
          .setLabel("Reddet!")
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true);
        const row = new ActionRowBuilder().addComponents(approved, denied);

        if (!data) {
          interaction.reply({
            content: "Başvuru ile ilgili veri bulunamadı!",
            ephemeral: true,
          });

          interaction.message.edit({ components: [row] });
          return;
        }

        const member = interaction.guild.members.cache.get(data);

        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: interaction.member.displayName,
                iconURL: interaction.member.displayAvatarURL({
                  dynamic: true,
                  size: 2048,
                }),
              })
              .setFooter({
                text: "Made With Jahky.",
                iconURL: client.users.cache
                  .get("618444525727383592")
                  .avatarURL({ dynamic: true, size: 2048 }),
              })
              .setColor(interaction.member.displayHexColor)
              .setThumbnail(interaction.member.displayAvatarURL())
              .setDescription(
                `Kullanıcının başvurusu ${interaction.member.toString()} tarafından onaylandı!`
              ),
          ],
        });

        interaction.message.edit({ components: [row] });
        config.interview.staffRole.map((x) => member.roles.add(x));

        await member.createDM();
        member.send({
          content: `${member.toString()} Yetkili başvurunuz, ${interaction.member.toString()} tarafından onaylandı! Yetkili sürecinde başarılar dileriz.`,
        });

        client.db.delete(`messages_${messageID}`);
        client.db.pull("interview", interaction.member.id)
      }

      if (interaction.customId === "denied") {
        if (
          config.interview.buttonStaff.some(
            (x) => !interaction.member.roles.cache.has(x)
          )
        )
          return;
        const messageID = interaction.message.id;

        const data = client.db.get(`messages_${messageID}`);

        const approved = new ButtonBuilder()
          .setCustomId("approved")
          .setLabel("Onayla!")
          .setStyle(ButtonStyle.Success)
          .setDisabled(true);

        const denied = new ButtonBuilder()
          .setCustomId("denied")
          .setLabel("Reddet!")
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true);
        const row = new ActionRowBuilder().addComponents(approved, denied);

        if (!data) {
          interaction.reply({
            content: "Başvuru ile ilgili veri bulunamadı!",
            ephemeral: true,
          });

          interaction.message.edit({ components: [row] });
          return;
        }

        const member = interaction.guild.members.cache.get(data);

        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: interaction.member.displayName,
                iconURL: interaction.member.displayAvatarURL({
                  dynamic: true,
                  size: 2048,
                }),
              })
              .setFooter({
                text: "Made With Jahky.",
                iconURL: client.users.cache
                  .get("618444525727383592")
                  .avatarURL({ dynamic: true, size: 2048 }),
              })
              .setColor(interaction.member.displayHexColor)
              .setThumbnail(interaction.member.displayAvatarURL())
              .setDescription(
                `Kullanıcının başvurusu ${interaction.member.toString()} tarafından reddedildi!`
              ),
          ],
        });

        interaction.message.edit({ components: [row] });

        await member.createDM();
        member.send({
          content: `${member.toString()} Yetkili başvurunuz, ${interaction.member.toString()} tarafından reddedildi! 2 Hafta sonra tekrar deneyebilirsin.`,
        });

        client.db.delete(`messages_${messageID}`);
        client.db.pull("interview", interaction.member.id)
      }
    }
    if (interaction.isModalSubmit()) {
      if (interaction.customId === "modal") {
        const NameInputValue = interaction.fields.getTextInputValue("name");
        const AgeInputValue = interaction.fields.getTextInputValue("age");
        const ActivityInputValue =
          interaction.fields.getTextInputValue("activity");
        const InviteInputValue = interaction.fields.getTextInputValue("invite");

        const embed = new EmbedBuilder()
          .setAuthor({
            name: interaction.member.displayName,
            iconURL: interaction.member.displayAvatarURL({
              dynamic: true,
              size: 2048,
            }),
          })
          .setFooter({
            text: "Made With Jahky.",
            iconURL: client.users.cache
              .get("618444525727383592")
              .avatarURL({ dynamic: true, size: 2048 }),
          })
          .setTitle("YENİ BAŞVURU VAR")
          .addFields({
            name: `Başvuran`,
            value: interaction.member.toString(),
          })
          .setFields(
            { name: "İsim", value: NameInputValue },
            { name: "Yaşı", value: AgeInputValue }
          )
          .addFields(
            { name: "Aktiflik", value: ActivityInputValue },
            { name: "Davet", value: InviteInputValue }
          )
          .setColor(interaction.member.displayHexColor)
          .setThumbnail(interaction.member.displayAvatarURL())
          .setDescription(
            "Kullanıcının başvurusu onaylamak için aşşağıda ki butonları kullanınız!"
          );

        const approved = new ButtonBuilder()
          .setCustomId("approved")
          .setLabel("Onayla!")
          .setStyle(ButtonStyle.Success);

        const denied = new ButtonBuilder()
          .setCustomId("denied")
          .setLabel("Reddet!")
          .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(approved, denied);

        const messages = await interaction.guild.channels.cache
          .get(config.interview.log)
          .send({ embeds: [embed], components: [row] });

        client.db.set(`messages_${messages.id}`, interaction.member.id);

        interaction.reply({
          content: `Başvurunuz başarıyla iletilmiştir!\n\nBaşvuru Bilgileri:\n**İSİM:** ${NameInputValue}\n**YAŞ:** ${AgeInputValue}\n**Aktiflik:** ${ActivityInputValue}\n**Davet:** ${InviteInputValue}`,
          ephemeral: true,
        });

        client.db.push("interview", interaction.member.id);
      }
    }
  });
};
