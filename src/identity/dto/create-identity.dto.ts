import { Role } from '../../auth/enum/user-role.dto';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsStrongPassword,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { CreateRestaurantDto } from '../../restaurants/dto/create-restaurant.dto';
import {Transform, Type} from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIdentityDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description:
      'Password must be at least 8 characters long, contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsIn([Role.USER, Role.RESTAURANT])
  role: Role;

  @ApiProperty()
  @ValidateIf((o) => o.role === Role.USER)
  @ValidateNested()
  @Type(() => CreateUserDto)
  @IsNotEmpty()
  client?: CreateUserDto;

  @ApiProperty()
  @ValidateIf((o) => o.role === Role.RESTAURANT)
  @ValidateNested()
  @Type(() => CreateRestaurantDto)
  @IsNotEmpty()
  restaurant?: CreateRestaurantDto;
}
