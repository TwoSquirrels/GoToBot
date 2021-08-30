import discord from "discord.js";
import dotenv from "dotenv";
import express from "express";
import fetch from "node-fetch";

const wait = (second: number): Promise<void> => new Promise(resolve => setTimeout(resolve, second * 1000));

dotenv.config();
const bot = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS] });
const server = express();

bot.once("ready", () => {
  console.log("Ready to bot!");
});

bot.on("interactionCreate", async interaction => {
  if (interaction.isCommand()) {
    const command = interaction as discord.CommandInteraction;
    switch (command.commandName) {
    case "goto":
      const dest = command.options.getString("行き先", true);
      let english = command.options.getString("英語", false);
      if (english) {
        english = english.toUpperCase();
        await command.reply("画像を生成中...");
      } else {
        await command.reply("行き先を翻訳中...");
        try {
          const translated = await fetch(process.env.TRANSLATE_API + `?text=${encodeURIComponent(dest)}&source=ja&target=en`).then(res => res.json());
          if (translated.code !== 200) throw new Error(translated.text);
          english = (translated.text as string).toUpperCase();
        } catch (err) {
          console.error(err);
          await command.editReply("翻訳に失敗しました。");
          break;
        }
        await command.editReply("画像を生成中...");
      }
      await wait(3);
      await command.editReply(`GoTo ${dest} (\`Go To ${english}\`)`);
      break;
    }
  }
});

bot.login(process.env.DISCORD_TOKEN);

server.get("/", (req, res) => res.send("<h1>GoToBot is working!</h1>"));
server.listen(3000, () => console.log("Ready to server!"));
