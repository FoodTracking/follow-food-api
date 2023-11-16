import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatusEnum } from '../../orders/entities/order-status.enum';

export class FindOrdersQueryDto extends PageOptionsDto {
  @IsOptional()
  @IsEnum(OrderStatusEnum, { each: true })
  status: OrderStatusEnum[];
}
