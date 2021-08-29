import discord from "discord.js";
import dotenv from "dotenv";

dotenv.config();
const bot = new discord.Client({ intents: [] });

bot.on("message", message => {
  if (message.content === "ping") message.reply("pong");
});

bot.login(process.env.DISCORD_TOKEN);
