import Discord from "discord.js";

import child from "child_process";
import dotenv from "dotenv";
import express from "express";
import fetch from "node-fetch";
import fs from "fs";

const wait = (second: number): Promise<void> => new Promise(resolve => setTimeout(resolve, second * 1000));
function execFile(file: string, args: string[]): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    console.log(`[${new Date()}] ${file} ${JSON.stringify(args)}`);
    child.execFile(
      file,
      args,
      { windowsHide: true },
      (error: child.ExecException | null, stdout: string, stderr: string): void => {
        // 出力を改行ごとに分けてロギング
        if (stdout) stdout.slice(0, -1).split("\n").forEach(out => console.log(out));
        if (stderr) stderr.slice(0, -1).split("\n").forEach(err => console.error(err));
        // 結果を返す
        if (error) reject(error);
        else resolve();
      }
    );
  })
};

(async () => {

  dotenv.config();
  const bot = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS] });
  const server = express();

  const vipUsers = (process.env.VIP ?? "").split(",");
  const cooldown = {
    time: Number(process.env.COOLTIME) * 1000,
    ignoreUsers: vipUsers,
    users: new Array<{ id: string, time: number }>(),
    // check cooldown
    check: function (userId: string, now: number): boolean {
      // ignore
      if (this.ignoreUsers.includes(userId)) return true;
      // refresh
      this.users = this.users.filter(user => now < user.time + this.time);
      // fetch
      if (this.users.some(user => user.id === userId)) return false;
      else {
        // update
        this.users.push({ id: userId, time: now });
        return true;
      }
    },
  };

  bot.once("ready", () => {
    console.log("Ready to bot!");
  });

  bot.on("interactionCreate", async interaction => {
    try {
      if (interaction.isCommand()) {
        const command = interaction as Discord.CommandInteraction;
        // cooldown
        if (!cooldown.check(command.user.id, command.createdTimestamp)) {
          command.reply({
            content: "コマンドを送るのが早すぎます！\n" +
              process.env.COOLTIME + "秒間、間隔を開けて送信してください。",
            ephemeral: true,
          });
          return;
        }
        // each command
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
              const msg = "翻訳に失敗しました。";
              await command.editReply(msg);
              throw new Error(msg);
            }
            await command.editReply("画像を生成中...");
          }
          try {
            const imageId = (await command.fetchReply()).id;
            await execFile("python3", ["gotoimage.py", imageId, dest, `Go To ${english}`, command.options.getString("背景色", false) ?? "1BABEF"]);
            await command.editReply({
              content: `\`\`\`\nGoTo ${dest.replace(/```/g, "​`​``​")}\n\`\`\`\`\`\`\nGo To ${english.split("").join(" ")}\n\`\`\``,
              files: [{
                attachment: `tmp/${imageId}.png`,
                name: `Go_To_${english.replace(/\\|\/|:|\*|\?|"|<|>|\|/g, "_")}.png`,
              }],
            });
            await fs.promises.unlink(`tmp/${imageId}.png`);
          } catch (err) {
            console.error(err);
            const msg = "画像生成に失敗しました。";
            await command.editReply(msg);
            throw new Error(msg);
          }
          break;
        }
      }
    } catch (err) {
      console.error(err);
    }
  });

  bot.login(process.env.BOT_TOKEN);

  server.get("/", (req, res) => res.send("<h1>GoToBot is working!</h1>"));
  server.listen(3000, () => console.log("Ready to server!"));

})();
