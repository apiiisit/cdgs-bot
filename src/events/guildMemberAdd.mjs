import { Events } from "discord.js";
import { client } from "../utils/controller.mjs";

client.on(Events.GuildMemberAdd, async (member) => {
  const guild = member.guild;
  const role = await guild.roles.fetch("1146477131384242287"); // role CDGS
  await member.roles.add(role);
});
