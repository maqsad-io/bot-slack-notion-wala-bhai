import {
  BlockObjectResponse,
  BulletedListItemBlockObjectResponse, MentionRichTextItemResponse,
  ToggleBlockObjectResponse, UserObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { NotionManager } from '../notion';

export interface NotionParserProps{
  notionClient:NotionManager;
}

export class StandUpManager {


  static getBulletedBlocks(blocks:BlockObjectResponse[]):BulletedListItemBlockObjectResponse[] {
    return blocks.filter(block => {
      return block.type == 'bulleted_list_item';
    }) as BulletedListItemBlockObjectResponse[];
  }

  static getToggleBlocks(blocks:BlockObjectResponse[]):ToggleBlockObjectResponse[] {
    return blocks.filter(block => {
      return block.type == 'toggle';
    }) as ToggleBlockObjectResponse[];
  }

  static isTodaysBlock(notion:ToggleBlockObjectResponse):boolean {
    const blockDate = new Date(notion.created_time);
    return (new Date()).toLocaleDateString() == blockDate.toLocaleDateString();
  }

  static getName(block:BulletedListItemBlockObjectResponse):string {
    const firstItem = block.bulleted_list_item?.rich_text?.[0];
    const mentionItem = firstItem as MentionRichTextItemResponse;
    const userData = mentionItem.mention as {user:UserObjectResponse};
    return userData.user.name ?? '';

  }

  private readonly notionManager:NotionManager;


  constructor(props:NotionParserProps) {
    this.notionManager = props.notionClient;
  }


  private async getTodaysBlock(blockID:string) {
    const notionBlocks = await this.notionManager.getChildBlocks(blockID, 6);
    const toggleBlocks = StandUpManager.getToggleBlocks(notionBlocks);
    const todayToggleBlock = toggleBlocks.filter(block => StandUpManager.isTodaysBlock(block));
    return todayToggleBlock?.[0];
  }


  async checkFillStatus(blockID:string):Promise<{name:string;didFill:boolean}[]> {
    const standUpBlock = await this.getTodaysBlock(blockID);
    const results = await this.notionManager.getChildBlocks(standUpBlock.id);
    const peopleList = StandUpManager.getBulletedBlocks(results);
    const standUpDocData = peopleList.map(people => {return { name: StandUpManager.getName(people), block: people };});

    return Promise.all(standUpDocData.map(async (item) => {return { name: item.name, didFill: await this.checkUserFill(item.block) };}));
  }

  private async checkUserFill(block:BulletedListItemBlockObjectResponse):Promise<boolean> {
    const results = await this.notionManager.getChildBlocks(block?.id);

    const workedOnBlockID = results[0]?.id;
    const willWorkOnBlockID = results[1]?.id;

    const [workedOnResults, willWorkOnResults] = await Promise.all([
      this.notionManager.getChildBlocks(workedOnBlockID),
      this.notionManager.getChildBlocks(willWorkOnBlockID),
    ]);

    const workedOnData = StandUpManager.getBulletedBlocks(workedOnResults)?.[0];
    const willWorkOnData = StandUpManager.getBulletedBlocks(willWorkOnResults)?.[0];

    const hasAddedWorkedOnInformation = workedOnData.bulleted_list_item.rich_text.length > 0;
    const hasAddedWillWorkOnInformation = willWorkOnData.bulleted_list_item.rich_text.length > 0;

    return hasAddedWorkedOnInformation && hasAddedWillWorkOnInformation;
  }


}