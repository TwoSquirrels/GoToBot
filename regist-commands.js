const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

require("dotenv").config();

const commands = [
  new SlashCommandBuilder()
    .setName("goto")
    .setDescription("Reply GoTo image")
    .addStringOption(option => option.setName("行き先").setDescription("GoToの下に付く文字列").setRequired(true))
    .addStringOption(option => option.setName("英語").setDescription("行き先の英語(未指定の場合はGoogle翻訳で翻訳したもの)").setRequired(false))
    .addStringOption(option => option.setName("背景色").setDescription("背景のカラーコード(デフォルト:1BABDE)").setRequired(false)),
]
  .map(command => command.toJSON());

const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    await rest.put(
      process.env.TEST_GUILD ?
        Routes.applicationGuildCommands(process.env.BOT_ID, process.env.TEST_GUILD) :
        Routes.applicationCommands(process.env.BOT_ID),
      { body: commands },
    );
    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }
})();
