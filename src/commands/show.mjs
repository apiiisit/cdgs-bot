import { SlashCommandBuilder } from "discord.js";
import { JsonDB } from "../utils/db.mjs";
let jsonDB;

export const data = new SlashCommandBuilder()
  .setName("show")
  .setDescription("แสดงข้อมูล")
  .addSubcommandGroup((subcommandgroup) =>
    subcommandgroup
      .setName("default")
      .setDescription("ค่าเริ่มต้น")
      .addSubcommand((subcommand) =>
        subcommand.setName("role").setDescription("แสดงบทบาทเริ่มต้น")
      )
  );

export const execute = async (interaction) => {
  jsonDB = new JsonDB(interaction.guild.id);

  selectGroup(interaction, interaction.options.getSubcommandGroup());
};

const selectGroup = (interaction, group) => {
  if (group === "default") {
    selectCommandDefault(interaction, interaction.options.getSubcommand());
  }
};
const selectCommandDefault = async (interaction, command) => {
  if (command === "role") {
    defaultRole(interaction);
  }
};

const defaultRole = async (interaction) => {
  const guild = interaction.guild;
  const data = jsonDB.findById("roles", { id: guild.id });
  if (!data.result)
    return await interaction.reply("ยังไม่ได้กำหนดบทบาทเริ่มต้น");

  const result = data.result;
  return await interaction.reply(
    `บทบาทเริ่มต้นคือ **${result.roleName}**\nตั้งโดย ${result.updateBy}\nเมื่อวันที่ ${result.updateDate}`
  );
};
