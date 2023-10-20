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
  UsePipes,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import {
  CreateRestaurantDto,
  createRestaurantSchema,
} from './dto/create-restaurant.dto';
import {
  UpdateRestaurantDto,
  updateRestaurantSchema,
} from './dto/update-restaurant.dto';
import {
  restaurantsFindAllQueryDto,
  RestaurantsFindAllQueryDto,
} from './dto/find-all-query.dto';
import { ZodValidationPipe } from '../common/pipes/zod.pipe';
import { RolesGuard } from '../auth/guard/roles.guard';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enum/user-role.dto';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('restaurants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @Roles(Role.RESTAURANT_OWNER)
  create(
    @Body(new ZodValidationPipe(createRestaurantSchema))
    createRestaurantDto: CreateRestaurantDto,
    @CurrentUser() user: User,
  ) {
    return this.restaurantsService.create(createRestaurantDto, user);
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
    return this.restaurantsService.findById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.RESTAURANT_OWNER)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateRestaurantSchema))
    updateRestaurantDto: UpdateRestaurantDto,
    @CurrentUser() user: User,
  ) {
    return this.restaurantsService.update(id, updateRestaurantDto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.RESTAURANT_OWNER)
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(id);
  }
}
