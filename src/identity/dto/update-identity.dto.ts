import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateIdentityDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  password: string;
}
