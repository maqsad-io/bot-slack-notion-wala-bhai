import { readFileSync } from 'fs';
import { AxiosPromise } from 'axios';
import { goodPeepsMessage, badPeepsStartMessage, badPeepsEndMessage } from '../constants';
import { NotionManager } from '../notion';
import { SlackManager } from '../slack';
import { StandUpManager } from '../stand-up-manager';

export interface BotManagerProps{
  goodPeepsImageUrl: string;
  badPeepsImageUrl: string;
  standUpBlockId: string;
  apiKey: string;
  slackFileUrl: string;
  channelUrl: string;
}

export interface SlackUser {
  [key: string]: string;
}

export class Bot {

  private static getSlackUsernameToIDMap(fileUrl: string) {
    return JSON.parse(readFileSync(fileUrl).toString());
  }

  private readonly slack: SlackManager;
  private readonly slackUsernamesToIDMap: SlackUser;
  private readonly goodPeepsImageUrl: string;
  private readonly badPeepsImageUrl: string;
  private readonly standUpBlockId: string;
  private readonly standUpManager: StandUpManager;

  constructor(props:BotManagerProps) {
    this.slack = new SlackManager({ channelURL: props.channelUrl });
    this.goodPeepsImageUrl = props.goodPeepsImageUrl;
    this.badPeepsImageUrl = props.badPeepsImageUrl;
    this.standUpBlockId = props.standUpBlockId;
    this.slackUsernamesToIDMap = Bot.getSlackUsernameToIDMap(props.slackFileUrl);
    this.standUpManager = new StandUpManager({ notionClient: new NotionManager(({ apiKey: props.apiKey })) });
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
      throw new Error('No one filled the standup document!'); // rejects the promise
    }

    let message = goodPeepsMessage;
    goodJobPeeps.forEach(peep => {
      message += `<@${this.getSlackID(peep)}>, `;
    });
    message = message.slice(0, message.length - 2);
    message.concat(' 👍');

    return this.slack.sendMessage({ message: message, imageUrl: this.goodPeepsImageUrl });
  }

  sendBadJobMessage(badJobPeeps: string[]) : Promise<AxiosPromise> {

    if (badJobPeeps.length === 0) {
      throw new Error('Everyone has filled the standup document!'); // rejects the promise
    }

    let message = badPeepsStartMessage;
    badJobPeeps.forEach(peep => {
      message += `<@${this.getSlackID(peep)}>, `;
    });
    message = message.slice(0, message.length - 2);
    message.concat(badPeepsEndMessage);

    return this.slack.sendMessage({ message: message, imageUrl: this.badPeepsImageUrl });
  }

  async start() {

    const standUpData = await this.standUpManager.checkFillStatus(this.standUpBlockId);
    const goodPeepsData = standUpData.filter(data => data.didFill).map(peep => peep.name);
    const badPeepsData = standUpData.filter(data => !data.didFill).map(peep => peep.name);

    console.log('Parsed notion data successfully');

    await this.sendGoodJobMessage(goodPeepsData);
    await this.sendBadJobMessage(badPeepsData);
  }

}

