import { Client, Collection, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import { readdirSync } from "node:fs";

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
export const commands = [];

const commandFiles = readdirSync("./src/commands/").filter((file) =>
  file.endsWith(".mjs")
);

for (const file of commandFiles) {
  const { data, execute } = await import(`../commands/${file}`);

  if (data && execute) {
    client.commands.set(data.name, { data, execute });
    commands.push(data.toJSON());
  } else {
    console.log(
      `[WARNING] The command at commands/${file} is missing a required "data" or "execute" property.`
    );
  }
}

readdirSync("./src/events/")
  .filter((file) => file.endsWith(".mjs"))
  .forEach((file) => {
    import(`../events/${file}`);
  });
