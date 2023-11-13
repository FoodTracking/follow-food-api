import { PageOptionsDto } from '../../common/dto/page-options.dto';
import {IsArray, IsOptional, IsString, IsUUID} from 'class-validator';
import {ApiPropertyOptional} from "@nestjs/swagger";

export class FindOrdersQueryDto extends PageOptionsDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly status?: string;

  @IsOptional()
  @IsUUID('4', { each: true })
  ids: string[];
}
