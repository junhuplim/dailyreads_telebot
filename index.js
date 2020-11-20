require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cron = require("node-cron");
const { Telegraf } = require("telegraf");
const pullMedium = require("./article");
const app = express();
const db = require('./models/index.js');

const apiToken = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf(apiToken);

cron.schedule("0 20 * * *", function () {
  pullMedium()
    .then(function (result) {
      articleLink = `[Your daily top picks!](${result.rss.channel[0].item[0].link[0]})`;
       (async () => {
        const users = await db.Users.findAll({ attributes: ["chatId"] });
        users.forEach((user) => 
          bot.telegram.sendMessage(user.chatId, articleLink, {
            parse_mode: "markdown",
            disable_web_page_preview: false,
          })
        );
      })();
    })
    .catch((err) => console.error(err));
}, {
  scheduled: true,
  timezone: process.env.TZ
});

bot.hears("/subscribe", async (ctx) => {
  try {
    await db.Users.create({ chatId: ctx.message.chat.id });
    return ctx.reply("successfully subscribed! Enjoy the knowledge");
  } catch (err) {
    console.log(err)
    return ctx.reply("you are already subscribed!");
  }
});

bot.hears("/unsubscribe", async (ctx) => {
  await db.Users.destroy({
    where: {
      chatId: ctx.message.chat.id,
    },
  });
  return ctx.reply("successfully unsubscribed, see you again!");
});

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hello Friend!'))
bot.hears("id", (ctx) => {
  return ctx.reply(ctx.chat.id);
  });
bot.launch()

// Configurations
app.use(bodyParser.json());

// User routes
app.use('/users', require('./routes/users'));

// Endpoints
app.get('/', (req,res) => res.send('Homepage'));

const PORT = process.env.PORT || 3000; 

// Listening
app.listen(PORT, () => {
     console.log(`Listening on port ${PORT}`);
});