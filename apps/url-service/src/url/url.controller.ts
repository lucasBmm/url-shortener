import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { OptionalAuth } from 'src/common/decorators/optional-auth.decorator';

type AuthRequest = Request & { user: { sub?: string } };

@Controller('url')
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private configService: ConfigService,
  ) {}

  @Get()
  async listUserUrls(@Req() req: Request & { user: { sub?: string } }) {
    const user = req.user as { sub?: string } | undefined;
    const userId = user?.sub;

    return this.urlService.findByUser(userId);
  }

  @Post()
  @OptionalAuth()
  async create(@Body() dto: CreateUrlDto, @Req() req: AuthRequest) {
    const user = req?.user as { sub?: string } | undefined;
    const userId = user?.sub;

    const url = await this.urlService.create(dto, userId);

    return {
      shortUrl: `${this.configService.get<string>('host')}/${url.shortCode}`,
      originalUrl: url.originalUrl,
    };
  }

  @Patch(':id')
  async updateUrl(
    @Param('id') id: string,
    @Body() newUrl: CreateUrlDto,
    @Req() req: AuthRequest,
  ) {
    const user = req?.user as { sub?: string } | undefined;
    const userId = user?.sub;

    return this.urlService.updateOriginalUrl(userId, id, newUrl.originalUrl);
  }

  @Delete(':id')
  async deleteUrl(@Param('id') id: string, @Req() req: AuthRequest) {
    const user = req?.user as { sub?: string } | undefined;
    const userId = user?.sub;

    return this.urlService.deleteUrl(userId, id);
  }
}
