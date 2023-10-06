import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("test")
  .setDescription("Replies with test!");

export async function execute(interaction) {
  await interaction.reply("test!");
}
