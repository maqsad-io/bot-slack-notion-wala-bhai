import { NotionManager } from '../notion';
import { StandUpManager } from '../stand-up-manager';
import { BotHelper } from './helper';

export interface BotManagerProps{
  standUpBlockId:string;
}

export class Bot {
  private readonly standUpManager: StandUpManager;
  private readonly botHelper: BotHelper;
  private readonly standUpBlockId: string;

  constructor(props: BotManagerProps) {
    this.standUpManager = new StandUpManager({ notionClient: new NotionManager(({ apiKey: '' })) });
    this.botHelper = new BotHelper({ imageUrl: '' });
    this.standUpBlockId = props.standUpBlockId;
  }

  async start() {

    const standUpData = await this.standUpManager.checkFillStatus(this.standUpBlockId);
    const goodPeepsData = standUpData.filter(data => data.didFill).map(peep => peep.name);
    const badPeepsData = standUpData.filter(data => !data.didFill).map(peep => peep.name);

    console.log('Parsed notion data successfully');

    await this.botHelper.sendGoodJobMessage(goodPeepsData);
    await this.botHelper.sendBadJobMessage(badPeepsData);
  }

}