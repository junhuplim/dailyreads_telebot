const express = require('express');
const bodyParser = require('body-parser');
const { Telegraf } = require("telegraf");
const User = require("./models/User");
const app = express();

// const url = 'https://api.telegram.org/bot';
const apiToken = '1472016467:AAH5F_4vfjAbknSxLLSN2HK-QwhB6vN54Ww';
const bot = new Telegraf(apiToken);

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

// Endpoints
app.get('/', (req,res) => res.send('INDEX'));

app.post('/', (req, res) => {
     console.log(req.body);
     res.send(req.body);
});

const PORT = process.env.PORT || 5000; 

// Listening
app.listen(PORT, () => {
     console.log(`Listening on port ${PORT}`);
});