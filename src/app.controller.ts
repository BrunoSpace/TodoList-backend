import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('app health check')
@Controller('/')
export class AppController {
  @Get()
  public health(): string {
    return 'OK';
  }
}
