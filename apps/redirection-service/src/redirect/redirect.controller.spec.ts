import { Test, TestingModule } from '@nestjs/testing';
import { RedirectController } from './redirect.controller';
import { RedirectService } from './redirect.service';
import { Response } from 'express';

describe('RedirectController', () => {
  let controller: RedirectController;
  let redirectService: jest.Mocked<RedirectService>;
  let res: Partial<Response>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedirectController],
      providers: [
        {
          provide: RedirectService,
          useValue: {
            resolve: jest.fn(),
            registerClick: jest.fn() as jest.Mock<Promise<void>, [string]>,
          },
        },
      ],
    }).compile();

    controller = module.get<RedirectController>(RedirectController);
    redirectService = module.get(RedirectService);

    res = {
      redirect: jest.fn(),
    };
  });

  describe('redirect', () => {
    it('should resolve shortUrl, register click and redirect', async () => {
      const shortCode = 'abc123';
      const targetUrl = 'https://example.com';

      redirectService.resolve.mockResolvedValue(targetUrl);
      redirectService.registerClick.mockResolvedValue({} as never);

      await controller.redirect(shortCode, res as Response);

      expect(redirectService.resolve).toHaveBeenCalledWith(shortCode);
      expect(redirectService.registerClick).toHaveBeenCalledWith(shortCode);
      expect(res.redirect).toHaveBeenCalledWith(302, targetUrl);
    });
  });
});
