import { SlashCommandBuilder } from "discord.js";
import { JsonDB } from "../utils/db.mjs";
let jsonDB;

export const data = new SlashCommandBuilder()
  .setName("default")
  .setDescription("ค่าเริ่มต้น")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("role")
      .setDescription("กำหนดบทบาทเริ่มต้นให้ User ที่เข้ามาใหม่")
      .addStringOption((option) =>
        option.setName("roleid").setDescription("บทบาท").setRequired(true)
      )
  );

export const execute = (interaction) => {
  jsonDB = new JsonDB(interaction.guild.id);

  selectCommand(interaction, interaction.options.getSubcommand());
};

const selectCommand = (interaction, command) => {
  if (command === "role") {
    roles(interaction);
  }
};

const roles = async (interaction) => {
  const roleid = interaction.options.getString("roleid");
  const guild = interaction.guild;
  const role = await guild.roles.fetch(roleid);
  if (!role) return await interaction.reply("ไม่พบ Role นี้");

  const data = jsonDB.findById("roles", { id: guild.id });

  const payload = {
    id: guild.id,
    guildName: guild.name,
    roleId: roleid,
    roleName: role.name,
    updateBy: interaction.user.username,
    updateDate: new Date().toLocaleString(),
  };

  let msgReply = `กำหนดบทบาทเริ่มต้น **${payload.roleName}** เรียบร้อย!`;
  let error = false;

  if (!data.result) {
    const addRes = jsonDB.add("roles", payload);
    error = addRes.error;
  } else {
    const updateRes = jsonDB.update("roles", payload);
    error = updateRes.error;
  }

  if (error) {
    msgReply = `กำหนดบทบาทเริ่มต้น **${payload.roleName}** ผิดพลาด!\n**${updateRes.result}`;
  }

  await interaction.reply(msgReply);
};
