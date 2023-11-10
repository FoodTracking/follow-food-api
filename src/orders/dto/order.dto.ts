import { OrderItemDto } from './order-item.dto';
import { OrderStatusEnum } from '../entities/order-status.enum';
import { RestaurantDto } from '../../restaurants/dto/restaurant.dto';
import { IsEnum } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class OrderDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => RestaurantDto)
  restaurant: RestaurantDto;

  @Expose()
  @Type(() => OrderItemDto)
  products: OrderItemDto[];

  @Expose()
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

  @Expose()
  @Type(() => Date)
  createdAt: Date;
}
