const express = require('express');
const bodyParser = require('body-parser');
const cron = require("node-cron");
const { Telegraf } = require("telegraf");
const pullMedium = require("./article");
const User = require("./models/User");
const app = express();

// const url = 'https://api.telegram.org/bot';
const apiToken = '1472016467:AAH5F_4vfjAbknSxLLSN2HK-QwhB6vN54Ww';
const bot = new Telegraf(apiToken);

bot.start((ctx) => ctx.reply('Welcome'))

cron.schedule("31 20 * * *", function () {
    pullMedium()
      .then(function (result) {
        articleLink = `[TODAY'S ARTICLE ](${result.rss.channel[0].item[0].link[0]})`;
        (async () => {
          const users = await User.findAll({ attributes: ["chatId"] });
          users.forEach((user) => 
            bot.telegram.sendMessage(user.chatId, articleLink, {
              parse_mode: "markdown",
              disable_web_page_preview: false,
            })
          );
        })();
      })
      .catch((err) => console.error(err));
  });

bot.hears("/subscribe", async (ctx) => {
  try {
    await User.create({ chatId: ctx.message.chat.id });
    return ctx.reply("successfully subscribed! Enjoy the knowledge");
  } catch (err) {
    return ctx.reply("you are already subscribed!");
  }
});

bot.hears("/unsubscribe", async (ctx) => {
  await User.destroy({
    where: {
      chatId: ctx.message.chat.id,
    },
  });
  return ctx.reply("successfully unsubscribed, see you again!");
});

  
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hello Friend!'))
bot.hears("id", (ctx) => {
  return ctx.reply(ctx.chat.id);
  });
bot.launch()

// Configurations
app.use(bodyParser.json());

// Endpoints
app.get('/', (req,res) => res.send('INDEX'));

// User routes
app.use('/users', require('./routes/users'));

app.post('/', (req, res) => {
     console.log(req.body);
     res.send(req.body);
});

const PORT = process.env.PORT || 5000; 

// Listening
app.listen(PORT, () => {
     console.log(`Listening on port ${PORT}`);
});