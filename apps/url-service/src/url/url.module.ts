import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { ShortUrl } from './entities/url.entity';
import { UrlRepository } from './url.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UrlRpcController } from './url.rpc.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShortUrl]),
    AuthModule,
  ],
  controllers: [UrlController, UrlRpcController],
  providers: [
    UrlService,
    {
      provide: 'IUrlRepository',
      useClass: UrlRepository,
    },
  ],
})
export class UrlModule {}
