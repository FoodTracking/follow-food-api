import { Expose, Transform } from 'class-transformer';
import { Role } from '../../auth/enum/user-role.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  role: Role;

  @ApiProperty()
  @Transform(({ obj }) =>
    obj.role === Role.USER
      ? `${obj.client.firstName} ${obj.client.lastName}`
      : `${obj.restaurant.name}`,
  )
  @Expose()
  fullname: string;
}
