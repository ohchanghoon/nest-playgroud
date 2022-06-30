import { SetMetadata } from '@nestjs/common';

// metadata : 어디선가 알고있어야 하는 정보
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
