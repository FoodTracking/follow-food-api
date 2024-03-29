import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsNumber, IsUUID } from 'class-validator';
import { OrderStatusEnum } from '../../orders/entities/order-status.enum';
import { Order } from '../../orders/entities/order.entity';
import { OrderItemDto } from '../../orders/dto/order-item.dto';
import { UserDto } from '../../users/dto/user.dto';

@Exclude()
export class RestaurantOrderDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  @Type(() => OrderItemDto)
  products: OrderItemDto[];

  @Expose()
  @IsNumber()
  @Transform(({ obj }) => {
    const o = obj as Order;
    return o.products.length;
  })
  quantity: number;

  @Expose()
  @Transform(({ obj }) => {
    const o = obj as Order;
    return o.products.reduce((acc, curr) => {
      return acc + curr.product.price * curr.quantity;
    }, 0);
  })
  @IsNumber()
  price: number;

  @Expose()
  status: OrderStatusEnum;

  @Expose()
  @Type(() => Date)
  createdAt: Date;
}
