import { ApiPropertyOptional } from '@nestjs/swagger';
import {IsNumber, IsOptional, IsString, IsUUID} from 'class-validator';
import { PageOptionsDto } from '../../common/dto/page-options.dto';

export class RestaurantsFindAllQueryDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsUUID('4', { each: true })
  @IsOptional()
  categories?: string[];

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
