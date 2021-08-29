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

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
	  await rest.put(
	    Routes.applicationGuildCommands("881401847905124353", "475585936386686997"),
	    { body: commands },
	  );
		await rest.put(
			Routes.applicationCommands("881401847905124353"),
			{ body: commands },
		);
		console.log("Successfully registered application commands.");
	} catch (error) {
		console.error(error);
	}
})();
