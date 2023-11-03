import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ProductDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  @Transform(({ value }) =>
    value ? `${process.env.API_BASE_URL}/public/${value}` : undefined,
  )
  image: string;

  @ApiProperty()
  price: number;

  constructor(partial: Partial<ProductDto>) {
    Object.assign(this, partial);
  }
}
