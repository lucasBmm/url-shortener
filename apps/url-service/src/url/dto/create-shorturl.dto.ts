export class CreateShortUrlDto {
  originalUrl: string;
  shortCode?: string;
  userId?: string;
  clickCount?: number;
}
