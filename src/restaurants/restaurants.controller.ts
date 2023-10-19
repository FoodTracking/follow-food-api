import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  ParseFloatPipe,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import {
  CreateRestaurantDto,
  createRestaurantSchema,
} from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ZodValidationPipe } from '../pipes/zod.pipe';
import {
  restaurantsFindAllQueryDto,
  RestaurantsFindAllQueryDto,
} from './dto/find-all-query.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createRestaurantSchema))
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Get()
  findAll(
    @Query(new ZodValidationPipe(restaurantsFindAllQueryDto))
    query: RestaurantsFindAllQueryDto,
  ) {
    return this.restaurantsService.findAllFiltered(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(createRestaurantSchema))
  update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(id);
  }
}
