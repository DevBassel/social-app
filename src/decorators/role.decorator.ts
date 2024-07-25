import { SetMetadata } from '@nestjs/common';
import { RoleType } from './enums/Roule.enum';

export const Role = (...roles: RoleType[]) => SetMetadata('rouls', roles);
