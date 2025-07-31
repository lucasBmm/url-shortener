import { PartialType } from '@nestjs/mapped-types';
import { CreateShortUrlDto } from './create-shorturl.dto';

export class UpdateShortUrlDto extends PartialType(CreateShortUrlDto) {}
