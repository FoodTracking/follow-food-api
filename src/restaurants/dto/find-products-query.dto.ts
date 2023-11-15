import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class FindProductsQueryDto extends PageOptionsDto {
  @IsOptional()
  @IsUUID('4', { each: true })
  ids: string[];
}
