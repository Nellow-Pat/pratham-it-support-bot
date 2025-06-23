import { Bot, InlineKeyboard } from 'grammy';
import dotenv from 'dotenv';

// Load environment variables from your .env file
dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL;

if (!BOT_TOKEN || !WEB_APP_URL) {
  console.error(
    'FATAL: TELEGRAM_BOT_TOKEN and WEB_APP_URL must be set in your .env file.',
  );
  process.exit(1);
}

console.log('--- Minimal Bot Starting (with NEW bot token) ---');
console.log('Using Web App URL:', WEB_APP_URL);
console.log('Make sure to chat with your NEW bot in Telegram.');

// 1. Create the bot instance
const bot = new Bot(BOT_TOKEN);

// 2. Create the /start command handler to send the button
bot.command('start', (ctx) => {
  console.log(`Received /start command from user ${ctx.from?.id}. Sending Web App button...`);
  const keyboard = new InlineKeyboard().webApp(
    'Open Web App',
    WEB_APP_URL,
  );

  ctx.reply('Click the button below to test the Web App with the new bot.', {
    reply_markup: keyboard,
  });
});

// 3. Create the listener for web_app_data
bot.on('message:web_app_data', (ctx) => {
  console.log('<<<<< SUCCESS! WEB_APP_DATA RECEIVED! >>>>>');
  console.log('Data received:', JSON.stringify(ctx.message.web_app_data, null, 2));

  ctx.reply(
    `✅ New bot received data successfully!\n\nPayload: ${ctx.message.web_app_data.data}`,
  );
});

// 4. Add a basic error handler
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof Error) {
    console.error('Error:', e.stack);
  } else {
    console.error('Unknown error object:', e);
  }
});

// 5. Start the bot
bot.start();

console.log('--- Minimal Bot is now running. ---');