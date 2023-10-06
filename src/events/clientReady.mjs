import { Events } from "discord.js";
import { client } from "../utils/controller.mjs";

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});
