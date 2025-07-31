import { Controller, Get, Param, Redirect, Res } from '@nestjs/common';
import { RedirectService } from './redirect.service';
import { Response } from 'express';

@Controller('redirect')
export class RedirectController {
  constructor(private readonly redirectService: RedirectService) {}

  @Get(':shortCode')
  async redirect(@Param('shortCode') shortUrl: string, @Res() res: Response) {
    const target = await this.redirectService.resolve(shortUrl);

    this.redirectService.registerClick(shortUrl);

    return res.redirect(302, target);
  }
}
