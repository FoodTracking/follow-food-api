import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductOverviewDto } from '../../products/dto/product-overview.dto';

export class OrderOverviewDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  status: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  @ValidateNested()
  @Type(() => ProductOverviewDto)
  products: ProductOverviewDto;
}
