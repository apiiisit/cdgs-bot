import { Events } from "discord.js";
import { client } from "../utils/controller.mjs";
import { JsonDB } from "../utils/db.mjs";
let jsonDB;

client.on(Events.GuildMemberAdd, async (member) => {
  const guild = member.guild;
  jsonDB = new JsonDB(guild.id);

  const roleRes = jsonDB.findById("roles", { id: guild.id });
  if (!roleRes) return;

  const role = await guild.roles.fetch(roleRes.result.roleId);
  await member.roles.add(role);
});
