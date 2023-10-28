import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class UpdateIdentityDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({
    description:
      'Password must be at least 8 characters long, contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol',
  })
  @IsStrongPassword()
  @IsOptional()
  password: string;
}
