import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { SortableDto } from './sortable.dto';

export class PageOptionsDto extends SortableDto {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(-1)
  @Max(50)
  @IsOptional()
  readonly size?: number = 1;

  get take(): number | undefined {
    const take = this.size;
    return take <= 0 ? undefined : take;
  }

  get skip(): number | undefined {
    const skip = (this.page - 1) * this.take;
    return !isFinite(skip) || skip <= 0 ? undefined : skip;
  }
}
