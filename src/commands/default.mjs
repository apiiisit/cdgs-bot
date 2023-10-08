import { SlashCommandBuilder } from "discord.js";
import { JsonDB } from "../utils/db.mjs";
const jsonDB = new JsonDB();

export const data = new SlashCommandBuilder()
  .setName("default")
  .setDescription("ค่าเริ่มต้น")
  .addStringOption((option) =>
    option.setName("roleid").setDescription("บทบาท")
  );

export const execute = async (interaction) => {
  const roleid = interaction.options.getString("roleid");
  if (roleid) return roles(interaction, roleid);
  else await interaction.reply("กรุณาเลือก!");
};

const roles = async (interaction, roleid) => {
  const guild = interaction.guild;
  const role = await guild.roles.fetch(roleid);
  if (!role) return await interaction.reply("ไม่พบ Role นี้");

  const data = jsonDB.findById("roles", { id: guild.id });

  const payload = {
    id: guild.id,
    guildName: guild.name,
    roleId: roleid,
    roleName: role.name,
  };

  let msgReply = `ตั้งค่าบทบาท **${payload.roleName}** เริ่มต้นเรียบร้อย!`;
  let error = false;

  if (!data.result) {
    const addRes = jsonDB.add("roles", payload);
    error = addRes.error;
  } else {
    const updateRes = jsonDB.update("roles", payload);
    error = updateRes.error;
  }

  if (error) {
    msgReply = `ตั้งค่าบทบาท **${payload.roleName}** เริ่มต้นผิดพลาด! **${updateRes.result}`;
  }

  await interaction.reply(msgReply);
};
