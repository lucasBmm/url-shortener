import { SetMetadata } from '@nestjs/common';

export const OPTIONAL_AUTH = 'optional_auth';
export const OptionalAuth = () => SetMetadata(OPTIONAL_AUTH, true);

