import { readFileSync } from 'fs';
import { AxiosPromise } from 'axios';
import { SlackManager } from '../slack';

export interface BotHelperProps{
  imageUrl: string;
}

export interface SlackUser {
  [key: string]: string;
}

export class BotHelper {

  private static getSlackUsernameToIDMap() {
    return JSON.parse(readFileSync('src/data/SlackUsersDict.json').toString());
  }

  private readonly slack: SlackManager;
  private readonly slackUsernamesToIDMap: SlackUser;
  private readonly imageUrl;

  constructor(props:BotHelperProps) {
    this.slack = new SlackManager({ channelURL: '' });
    this.slackUsernamesToIDMap = BotHelper.getSlackUsernameToIDMap();
    this.imageUrl = props.imageUrl;
  }

  private getSlackID(username: string): string | null {
    let userID = null;
    for (let key in this.slackUsernamesToIDMap) {
      if (username.toLowerCase().trim() === key.toLowerCase().trim()) {
        userID = this.slackUsernamesToIDMap[key];
      }
    }
    return userID;
  }

  sendGoodJobMessage(goodJobPeeps: string[]) : Promise<AxiosPromise> {
    if (goodJobPeeps.length === 0) {
      throw new Error('Oops! No good peeps'); // rejects the promise
    }

    let message = 'Thanks for filling the standup doc on Notion, great job guys! ';
    goodJobPeeps.forEach(peep => {
      message += `<@${this.getSlackID(peep)}>, `;
    });
    message = message.slice(0, message.length - 2);
    message += ' 👍';

    return this.slack.sendMessage({ message: message, imageUrl: this.imageUrl });
  }

  sendBadJobMessage(badJobPeeps: string[]) : Promise<AxiosPromise> {

    if (badJobPeeps.length === 0) {
      throw new Error('Oops! No bad peeps'); // rejects the promise
    }

    let message = 'Why you no fill standup doc? ';
    badJobPeeps.forEach(peep => {
      message += `<@${this.getSlackID(peep)}>, `;
    });
    message = message.slice(0, message.length - 2);
    message += '.\n Bhai is very disappointed 😔';

    return this.slack.sendMessage({ message: message, imageUrl: this.imageUrl });
  }

}

