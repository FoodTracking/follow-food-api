import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class OrderItemDto {
  @Expose()
  productId: string;

  @Expose()
  @Transform(({ obj }) => obj.product.name)
  name: string;

  @Expose()
  quantity: string;
}
