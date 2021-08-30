const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

require("dotenv").config();

const commands = [
  new SlashCommandBuilder()
    .setName("goto")
    .setDescription("Reply GoTo image")
    .addStringOption(option => option.setName("行き先").setDescription("GoToの下に付く文字列").setRequired(true))
    .addStringOption(option => option.setName("英語").setDescription("行き先の英語").setRequired(false)),
]
  .map(command => command.toJSON());

const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.BOT_ID, process.env.TEST_GUILD),
      { body: commands },
    );
    await rest.put(
      Routes.applicationCommands(process.env.BOT_ID),
      { body: commands },
    );
    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }
})();
