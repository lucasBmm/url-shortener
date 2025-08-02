import { Test, TestingModule } from '@nestjs/testing';
import { RedirectService } from './redirect.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { TimeoutError } from 'rxjs';

describe('RedirectService', () => {
  let service: RedirectService;
  let cacheManager: { get: jest.Mock; set: jest.Mock };
  let rpcClient: { connect: jest.Mock; send: jest.Mock };
  let eventClient: { emit: jest.Mock };

  beforeEach(async () => {
    cacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    rpcClient = {
      connect: jest.fn(),
      send: jest.fn(),
    };

    eventClient = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedirectService,
        { provide: CACHE_MANAGER, useValue: cacheManager },
        { provide: 'URL_RPC_CLIENT', useValue: rpcClient },
        { provide: 'URL_EVENT_CLIENT', useValue: eventClient },
      ],
    }).compile();

    service = module.get<RedirectService>(RedirectService);
  });

  describe('resolve', () => {
    const shortCode = 'abc123';
    const cacheKey = `short-url:${shortCode}`;

    it('should return cached url if found', async () => {
      cacheManager.get.mockResolvedValue('https://cached-url.com');

      const result = await service.resolve(shortCode);

      expect(cacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(result).toBe('https://cached-url.com');
      expect(rpcClient.connect).not.toHaveBeenCalled();
    });

    it('should call rpcClient and cache result if not cached', async () => {
      cacheManager.get.mockResolvedValue(null);
      rpcClient.connect.mockResolvedValue(undefined);

      rpcClient.send.mockReturnValue(
        of({ originalUrl: 'https://resolved-url.com' }),
      );

      cacheManager.set.mockResolvedValue(undefined);

      const result = await service.resolve(shortCode);

      expect(cacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(rpcClient.connect).toHaveBeenCalled();
      expect(rpcClient.send).toHaveBeenCalledWith(
        { cmd: 'resolve_short_url' },
        shortCode,
      );
      expect(cacheManager.set).toHaveBeenCalledWith(
        cacheKey,
        'https://resolved-url.com',
        60,
      );
      expect(result).toBe('https://resolved-url.com');
    });

    it('should throw NotFoundException with timeout message on TimeoutError', async () => {
      cacheManager.get.mockResolvedValue(null);
      rpcClient.connect.mockResolvedValue(undefined);

      rpcClient.send.mockReturnValue(
        throwError(() => new TimeoutError()),
      );

      await expect(service.resolve(shortCode)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.resolve(shortCode)).rejects.toThrow(
        'Timeout resolving short code',
      );
    });

    it('should throw NotFoundException on other errors', async () => {
      cacheManager.get.mockResolvedValue(null);
      rpcClient.connect.mockResolvedValue(undefined);

      rpcClient.send.mockReturnValue(
        throwError(() => new Error('Some error')),
      );

      await expect(service.resolve(shortCode)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.resolve(shortCode)).rejects.toThrow(
        'Short code not found',
      );
    });
  });

  describe('registerClick', () => {
    it('should emit url_clicked event with shortCode and timestamp', () => {
      const shortCode = 'abc123';

      jest.useFakeTimers().setSystemTime(new Date('2025-08-02T12:00:00Z'));

      service.registerClick(shortCode);

      expect(eventClient.emit).toHaveBeenCalledWith(
        { cmd: 'url_clicked' },
        { shortCode, timestamp: Date.now() },
      );

      jest.useRealTimers();
    });
  });
});
