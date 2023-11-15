import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatusEnum } from '../../orders/entities/order-status.enum';

export class FindOrdersQueryDto extends PageOptionsDto {
  @IsOptional()
  @IsEnum(OrderStatusEnum, { each: true })
  status: OrderStatusEnum[];
}
