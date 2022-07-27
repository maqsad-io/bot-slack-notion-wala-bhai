import { Bot } from './lib/bot';

export function startBot() {
  console.log('Bot is starting!');
  const bot = new Bot({ standUpBlockId: '' });
  bot.start().then(()=>{
    console.log('Bot work completed 😎');
  }).catch(e=>{
    console.log('Something went wrong :/', e);
  });
}

startBot();