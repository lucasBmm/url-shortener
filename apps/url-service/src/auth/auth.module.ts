import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UrlModule } from 'src/url/url.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'),
        signOptions: { expiresIn: '1h' },
        global: true,
      }),
    }),
    forwardRef(() => UrlModule)
  ],
  exports: [JwtModule]
})
export class AuthModule {}
