import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/decorators/role.decorator';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userServices: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.get(Role, context.getHandler());
    // console.log(role);

    if (!role) return true;

    const { id } = context.switchToHttp().getRequest().user;

    const user = await this.userServices.findOne(id);

    return role.includes(user.role);
  }
}
