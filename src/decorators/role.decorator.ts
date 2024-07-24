import { Reflector } from '@nestjs/core';
import { RoleType } from './enums/Roule.enum';

export const Role = Reflector.createDecorator<RoleType[]>();
