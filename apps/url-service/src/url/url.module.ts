import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { ShortUrl } from './entities/url.entity';
import { UrlRepository } from './url.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ShortUrl]), AuthModule],
  controllers: [UrlController],
  providers: [
    UrlService,
    {
      provide: 'IUrlRepository',
      useClass: UrlRepository,
    },
  ],
})
export class UrlModule {}
