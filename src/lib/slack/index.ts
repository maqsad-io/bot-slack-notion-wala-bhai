import axios, { AxiosRequestConfig } from 'axios';


export interface SlackManagerProps{

  channelURL:string;

}
export class SlackManager {

  private readonly channelURL: string;

  constructor(props: SlackManagerProps) {
    this.channelURL = props.channelURL;
  }


  async sendMessage(props: { imageUrl: string; message: string }) : Promise<any> {
    let config:AxiosRequestConfig = {
      method: 'post',
      url: this.channelURL,
      headers: { 'Content-type': 'application/json' },
      data: { text: props.message },
    };
    if (props.imageUrl) {
      config.data.attachments = [
        {
          fallback: '',
          image_url: props.imageUrl,
        },
      ];
    }

    const response = await axios(config);
    return JSON.stringify(response.data);
  }

}


