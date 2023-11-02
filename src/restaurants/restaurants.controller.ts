import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantsFindAllQueryDto } from './dto/find-all-query.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enum/user-role.dto';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { Identity } from '../identity/entities/identity.entity';
import { ApiTags } from '@nestjs/swagger';
import { ProductDto } from '../products/dto/product.dto';
import { plainToInstance } from 'class-transformer';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Order } from '../orders/entities/order.entity';

@Controller('restaurants')
@ApiTags('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @Roles(Role.RESTAURANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(
    @Body()
    createRestaurantDto: CreateRestaurantDto,
    @CurrentUser() user: Identity,
  ) {
    return this.restaurantsService.create(createRestaurantDto, user);
  }

  @Get()
  findAll(
    @Query()
    query: RestaurantsFindAllQueryDto,
  ) {
    return this.restaurantsService.findAllFiltered(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findById(id);
  }

  @Get(':id/products')
  async findRestaurantProducts(@Param('id') id: string) {
    const entities = await this.restaurantsService.findProducts(id);
    return entities.map((entity) => plainToInstance(ProductDto, entity));
  }

  @Get(':id/orders')
  async findRestaurantOrders(@Param('id') id: string) {
    const entities = await this.restaurantsService.findOrders(id);
    return entities.map((entity) => plainToInstance(Order, entity));
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.RESTAURANT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body()
    updateRestaurantDto: UpdateRestaurantDto,
    @CurrentUser() user: Identity,
  ) {
    return this.restaurantsService.update(id, updateRestaurantDto, user);
  }

  @Patch(':id/approve')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  approve(@Param('id') id: string) {
    return this.restaurantsService.process(id, true);
  }

  @Patch(':id/reject')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  reject(@Param('id') id: string) {
    return this.restaurantsService.process(id, false);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.RESTAURANT)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(id);
  }
}
