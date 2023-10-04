import { readdirSync } from "node:fs";

const eventFiles = readdirSync("./events/").filter((file) =>
  file.endsWith(".mjs")
);

for (const event of eventFiles) {
  import(`./events/${event}`);
}
