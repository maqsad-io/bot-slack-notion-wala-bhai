import { Client } from '@notionhq/client';
import { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';


export interface NotionManagerProps{
  apiKey:string;
}

export class NotionManager {
  private readonly client:Client;

  constructor(props:NotionManagerProps) {
    this.client = new Client({ auth: props.apiKey });
  }

  async getChildBlocks(blockID:string, pageSize = 50):Promise<BlockObjectResponse[]> {
    const { results } =await this.client.blocks.children.list({
      block_id: blockID,
      page_size: pageSize,
    });

    return results as BlockObjectResponse[];

  }


}