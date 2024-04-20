import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InfobipHttpClient } from '../http-clients/infobip.http-client';

@Injectable()
export class ChannelService {
  public constructor(
    private readonly infobipHttpClient: InfobipHttpClient,
    private readonly configService: ConfigService,
  ) {}

  public async send(destination: string, message: string): Promise<void> {
    if (this.configService.get('SEND_MESSAGE') === 'false') {
      return;
    }

    return this.infobipHttpClient.sendSms(destination, message);
  }
}
