import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class SortableDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional()
  @IsEnum(['ASC', 'DESC'])
  @IsOptional()
  order?: 'ASC' | 'DESC';
}
