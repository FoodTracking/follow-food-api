import { PartialType } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  @IsUUID(4)
  @IsNotEmpty()
  id: string;
}
