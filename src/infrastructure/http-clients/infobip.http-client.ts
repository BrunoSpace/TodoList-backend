import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InfobipFactory } from './infobip.factory';
import { Infobip, AuthType } from '@infobip-api/sdk';

@Injectable()
export class InfobipHttpClient {
  private readonly infobipClient: Infobip;

  constructor() {
    this.infobipClient = new Infobip({
      baseUrl: process.env.INFOBIP_URL,
      apiKey: process.env.INFOBIP_API_KEY,
      authType: AuthType.ApiKey,
    });
  }

  public async sendSms(to: string, text: string): Promise<void> {
    const body = InfobipFactory.createInfobipSmsMessage(to, text);

    try {
      await this.infobipClient.channels.sms.send(body);
    } catch (error) {
      throw new InternalServerErrorException('Failed to send SMS via Infobip');
    }
  }
}
