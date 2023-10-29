import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  restaurantId: string;

  @ApiProperty()
  @IsArray()
  @Type(() => CreateOrderItemDto)
  products: CreateOrderItemDto[];
}

export class CreateOrderItemDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsNotEmpty()
  quantity: number;
}
