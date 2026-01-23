import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck() {
    return {
      status: 'ok',
      service: 'ShieldAuth API',
      timestamp: new Date().toDateString(),
    };
  }
}
