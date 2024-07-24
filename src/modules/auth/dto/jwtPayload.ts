import { RoleType } from 'src/decorators/enums/Roule.enum';

export interface JwtPayload {
  id: number;
  email: string;
  name: string;
  role: RoleType;
}
