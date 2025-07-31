import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { RedirectModule } from './redirect/redirect.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    RedirectModule,
  ],
})
export class AppModule {}
