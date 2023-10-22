import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class RestaurantsFindAllQueryDto {
  @ApiPropertyOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsString()
  lat?: number;

  @ApiPropertyOptional()
  @IsString()
  long?: number;

  @ApiPropertyOptional()
  @IsNumber()
  radius?: number;
}
