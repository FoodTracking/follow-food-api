import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { Identity } from '../identity/entities/identity.entity';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enum/user-role.dto';
import { plainToInstance } from 'class-transformer';
import { OrderDto } from './dto/order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() identity: Identity,
  ) {
    return this.ordersService.create(identity, createOrderDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const entity = this.ordersService.findById(id);
    return plainToInstance(OrderDto, entity);
  }

  @Patch(':id/next')
  @Roles(Role.ADMIN, Role.RESTAURANT)
  update(@Param('id') id: string) {
    return this.ordersService.next(id);
  }
}
