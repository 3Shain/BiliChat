import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { BilibiliController } from './controllers/bilibili.controller';

import { AcfunController } from './controllers/acfun.controller';
import { BilibiliUserService } from './services/bili-user.service';
import { AddonController } from './controllers/addon.controller';
import { AddonService } from './services/addon.service';
import { AddonProxyMiddleware } from './middlewares/addon-proxy.middleware';

@Module({
  controllers: [AcfunController, BilibiliController, AddonController],
  providers: [
    BilibiliUserService, AddonService
  ],
})
export class BackendCoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AddonProxyMiddleware)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL
      });
  }
}
