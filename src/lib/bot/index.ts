import { NotionManager } from '../notion';
import { SlackManager } from '../slack';
import { StandUpManager } from '../stand-up-manager';

export class Bot {

  private readonly standUpManager: StandUpManager;
  // private readonly slack: SlackManager;

  constructor() {
    // this.slack = new SlackManager({ channelURL: '' });
    this.standUpManager = new StandUpManager({ notionClient: new NotionManager({ apiKey: '' }) });
  }

  async start() {

    // const results = await this.standUpManager.checkFillStatus('');
    //
    // const goodPeeps = results.filter(peep => peep.didFill);
    //
    // const badPeeps = results.filter(peep => !peep.didFill);
    //
    // await this.botHelper.sendGoodJobMessage(goodPeeps);
    // await this.botHelper.sendBadJobMessage(badPeeps);


  }
  //
  // async sendCustomMessage(message:string, imageUrl:string) {
  //   await this.slack.sendSlackMessage(message, imageUrl);
  // }
  // //
  // //
  // // sendGoodJobMessage(goodJobPeeps: string[]): Promise<AxiosPromise> {
  // //   if (goodJobPeeps.length === 0) {
  // //     return;
  // //   }
  // //
  // //   let message =
  // //           'Thanks for filling the standup doc on Notion, great job guys! ';
  // //   goodJobPeeps.forEach((peep) => {
  // //     message += `<@${this.getSlackID(peep)}>, `;
  // //   });
  // //   message = message.slice(0, message.length - 2);
  // //   message += ' 👍';
  // //
  // //   const imageUrl = process.env.GOOD_JOB_IMAGE_URL;
  // //   return this.slack.sendSlackMessage(message, imageUrl);
  // // }
  // //
  // // sendBadJobMessage(badJobPeeps: string[]): Promise<AxiosPromise> {
  // //   if (badJobPeeps.length === 0) {
  // //     return;
  // //   }
  // //
  // //   let message = 'Why you no fill standup doc? ';
  // //   badJobPeeps.forEach((peep) => {
  // //     message += `<@${this.getSlackID(peep)}>, `;
  // //   });
  // //   message = message.slice(0, message.length - 2);
  // //   message += '.\n Bhai is very disappointed 😔';
  // //   // message += '.\n Bhai is very disappointed 😠';
  // //
  // //   const imageUrl = process.env.BAD_JOB_IMAGE_URL;
  // //   return this.slack.sendSlackMessage(message, imageUrl);
  // // }
  // //
  // // private static getSlackUsernameToIDMap() {
  // //   return JSON.parse(readFileSync('src/data/SlackUsersDict.json').toString());
  // // }
  // //
  // // private getSlackID(username?: string): string | null {
  // //   for (let key in this.slackUsernamesToIDMap) {
  // //     if (username.toLowerCase().trim() === key.toLowerCase().trim()) {
  // //       return this.slackUsernamesToIDMap[key];
  // //     }
  // //   }
  // //   return username;
  // // }
}