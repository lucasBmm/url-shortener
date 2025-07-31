import { IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsUrl({ require_protocol: true }, { message: 'Invalid URL. Include the protocol http:// or https://' })
  originalUrl: string;
}
