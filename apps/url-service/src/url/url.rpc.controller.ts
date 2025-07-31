import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { UrlService } from './url.service';

@Controller()
export class UrlRpcController {
  constructor(private readonly urlService: UrlService) {}

  @MessagePattern({ cmd: 'resolve_short_url' })
  async resolve(@Payload() shortCode: string) {
    return this.urlService.findByShortUrl(shortCode);
  }

  @EventPattern({ cmd: 'url_clicked' })
  async handleClick(@Payload() data: { shortCode: string; timestamp: number }) {
    return this.urlService.registerClick(data.shortCode, data.timestamp);
  }
}
