import { Expose, Transform } from 'class-transformer';
import { Role } from '../../auth/enum/user-role.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiPropertyOptional()
  @Expose()
  @Transform(({ value }) =>
    value ? `${process.env.API_BASE_URL}/public/${value}` : undefined,
  )
  avatar: string;

  @ApiProperty()
  @Transform(({ obj }) =>
    obj.role === Role.USER
      ? `${obj.client.firstName} ${obj.client.lastName}`
      : `${obj.restaurant.name}`,
  )
  @Expose()
  name: string;
}
