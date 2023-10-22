import { Role } from '../../auth/enum/user-role.dto';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsStrongPassword,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { CreateRestaurantDto } from '../../restaurants/dto/create-restaurant.dto';
import { Type } from 'class-transformer';

export class CreateIdentityDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  role: Role;

  @ValidateIf((o) => o.role === Role.USER)
  @ValidateNested()
  @Type(() => CreateUserDto)
  @IsNotEmpty()
  client?: CreateUserDto;

  @ValidateIf((o) => o.role === Role.RESTAURANT)
  @ValidateNested()
  @Type(() => CreateRestaurantDto)
  @IsNotEmpty()
  restaurant?: CreateRestaurantDto;
}
