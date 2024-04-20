import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ChannelService } from './channels/channel.service';
import { InfobipHttpClient } from './http-clients/infobip.http-client';

@Module({
  imports: [],
  providers: [ChannelService, ConfigService, InfobipHttpClient],
  exports: [ChannelService],
})
export class InfrastructureModule {}
