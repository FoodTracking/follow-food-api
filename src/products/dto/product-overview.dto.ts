import { IsNumber, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class ProductOverviewDto {
  @Expose({ name: 'productId' })
  @ApiProperty()
  @IsUUID()
  id: string;

  @Expose()
  @ApiProperty()
  @Transform(({ obj }) => obj.product.name)
  @IsString()
  name: string;

  @Expose()
  @ApiProperty()
  @IsNumber()
  quantity: number;
}
