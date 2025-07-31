import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Injectable()
export class RedirectService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('URL_RPC_CLIENT')
    private readonly rpcClient: ClientProxy,
    @Inject('URL_EVENT_CLIENT')
    private readonly eventClient: ClientProxy,
  ) {}

  async resolve(shortCode: string): Promise<string> {
    const cacheKey = `short-url:${shortCode}`;
    const cached = await this.cacheManager.get<string>(cacheKey);

    if (cached) {
      return cached;
    }

    const RPC_TIMEOUT = 200;

    await this.rpcClient.connect();

    try {
      const { originalUrl } = await firstValueFrom(
        this.rpcClient
          .send<{
            originalUrl: string;
          }>({ cmd: 'resolve_short_url' }, shortCode)
          .pipe(timeout(RPC_TIMEOUT)),
      );

      await this.cacheManager.set(cacheKey, originalUrl, 60);

      return originalUrl;
    } catch (err) {
      if (err instanceof TimeoutError) {
        throw new NotFoundException('Timeout resolving short code');
      }
      throw new NotFoundException('Short code not found');
    }
  }

  registerClick(shortCode: string): void {
    this.eventClient.emit(
      { cmd: 'url_clicked' },
      { shortCode, timestamp: Date.now() },
    );
  }
}
