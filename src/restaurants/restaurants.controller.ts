import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { RestaurantDto } from './dto/restaurant.dto';
import { RestaurantOrderDto } from './dto/restaurant-order.dto';
import { RestaurantDetailsDto } from './dto/restaurant-details.dto';
import { FindOrdersQueryDto } from './dto/find-orders-query.dto';
import { FindProductsQueryDto } from './dto/find-products-query.dto';

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
  async findAll(
    @Query()
    query: RestaurantsFindAllQueryDto,
  ) {
    const entities = await this.restaurantsService.findAllFiltered(query);
    return entities.map((entity) => plainToInstance(RestaurantDto, entity));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const entity = await this.restaurantsService.findById(id);
    return plainToInstance(RestaurantDetailsDto, entity);
  }

  @Get(':id/products')
  async findRestaurantProducts(
    @Param('id') id: string,
    @Query() query: FindProductsQueryDto,
  ) {
    const entities = await this.restaurantsService.findProducts(id, query);
    return entities.map((entity) => plainToInstance(ProductDto, entity));
  }

  @Get(':id/orders')
  async findRestaurantOrders(
    @Param('id') id: string,
    @Query() query: FindOrdersQueryDto,
  ) {
    const entities = await this.restaurantsService.findOrders(id, query);
    return entities.map((entity) =>
      plainToInstance(RestaurantOrderDto, entity),
    );
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
    if (user.id !== id && user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You are not allowed to update other restaurants',
      );
    }
    return this.restaurantsService.update(id, updateRestaurantDto, user);
  }

  // NOTE: This is not implemented yet
  // @Patch(':id/approve')
  // @Roles(Role.ADMIN)
  // @UseGuards(JwtAuthGuard)
  // approve(@Param('id') id: string) {
  //   return this.restaurantsService.process(id, true);
  // }
  //
  // @Patch(':id/reject')
  // @Roles(Role.ADMIN)
  // @UseGuards(JwtAuthGuard)
  // reject(@Param('id') id: string) {
  //   return this.restaurantsService.process(id, false);
  // }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.RESTAURANT)
  @UseGuards(JwtAuthGuard)
  remove(@CurrentUser() identity: Identity, @Param('id') id: string) {
    if (identity.id !== id && identity.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You are not allowed to delete other restaurants',
      );
    }
    return this.restaurantsService.remove(id);
  }
}
