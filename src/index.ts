import config from './config/config';
import { Bot } from './lib/bot';


export function startBot() {
  console.log('Bot is starting!');
  const bot = new Bot({
    standUpBlockId: config.STANDUP_BLOCK_ID,
    badPeepsImageUrl: config.BAD_PEEPS_IMAGE_URL,
    goodPeepsImageUrl: config.GOOD_PEEPS_IMAGE_URL,
    apiKey: config.API_KEY,
    channelUrl: config.CHANNEL_URL,
    slackFileUrl: config.SLACK_DATA_FILE_PATH,
  });
  bot.start().then(()=>{
    console.log('Bot work completed 😎');
  }).catch(e=>{
    console.log('Something went wrong :/', e);
  });
}

startBot();
//  const bot = new Bot({ standUpBlockId: '18bb9709ac9743dfb520f3edcecaede9', badPeepsImageUrl: 'https://i.stack.imgur.com/su0VS.png', goodPeepsImageUrl: 'https://i.stack.imgur.com/su0VS.png', apiKey: 'secret_gMeGwpDwstQrMMiyrTQJJ1TEuA8jUAEFxPaY1jAxugx', channelUrl: 'https://maqsad-group.slack.com/archives/C029H7MEX1P', slackFileUrl: './data/SlackUsersDict.json' });