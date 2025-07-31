import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { timeout } from 'rxjs/operators';


@Injectable()
export class RedirectService {
  constructor(
    @Inject('URL_RPC_CLIENT')
    private readonly rpcClient: ClientProxy,
    @Inject('URL_EVENT_CLIENT')
    private readonly eventClient: ClientProxy,
  ) {}

  async resolve(shortCode: string): Promise<string> {
    const RPC_TIMEOUT = 200;

    await this.rpcClient.connect();

    try {
      const { originalUrl } = await firstValueFrom(
        this.rpcClient
          .send<{ originalUrl: string }>(
            { cmd: 'resolve_short_url' },
            shortCode,
          )
          .pipe(timeout(RPC_TIMEOUT)),
      );

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
