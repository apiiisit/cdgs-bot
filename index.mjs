import { REST, Routes } from "discord.js";
import { client, commands } from "./src/utils/controller.mjs";

const rest = new REST().setToken(process.env.TOKEN);
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );
    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();

client.login(process.env.TOKEN);
