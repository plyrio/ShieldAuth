import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiProduces } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiProduces('application/json')
  @ApiOkResponse({
    description: 'Health check',
    schema: {
      example: {
        status: 'ok',
        service: 'ShieldAuth API',
        timestamp: '2026-01-23T13:29:20.332Z',
      },
    },
  })
  health() {
    return this.appService.healthCheck();
  }
}
