import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateIdentityDto {
  @ApiPropertyOptional()
  @IsString()
  email: string;

  @ApiPropertyOptional()
  @IsString()
  password: string;
}
