# GoToBot

GoToトラベルのコラ画像を生成するDiscordBot

[招待リンク](https://discord.com/api/oauth2/authorize?client_id=881401847905124353&permissions=1342229504&scope=bot%20applications.commands)

## 使い方

```
/goto {行き先} {英語=行き先を翻訳したもの} {背景色=1BABDE}
```

## 技術

- TypeScript
- [repl.it](https://replit.com/@RomanGames/GoToBot)
- discord.js
- express
- Google Apps Script (for translate)
- Python3
- Pillow

## 動かし方

1. リポジトリをclone
2. `npm i`を叩き`node_modules`をインストール
3. `pip3 install Pillow`を叩きPillowをインストール
4. DiscordBotを作成
5. `.env`ファイルを作成し、`BOT_TOKEN`にDiscordBotのToken、`TRANSLATE_API`に翻訳APIのURL、`BOT_ID`にDiscordBotのID、`TEST_GUILD`にテスト用ギルドのIDを指定
6. `npm run regist`を叩きコマンドを登録
7. `npm run start`でBotを起動
8. `Ctrl+C`でBotを終了

## License

[Apache License, Version 2.0](https://apache.org/licenses/LICENSE-2.0)
