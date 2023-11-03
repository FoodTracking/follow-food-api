import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RestaurantsFindAllQueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lat?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  long?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  radius?: number;
}
