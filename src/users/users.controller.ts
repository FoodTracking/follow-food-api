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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../auth/enum/user-role.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { plainToInstance } from 'class-transformer';
import { UserOrderDto } from './dto/user-order.dto';
import { FindOrdersQueryDto } from '../restaurants/dto/find-orders-query.dto';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { Identity } from '../identity/entities/identity.entity';

@Controller('users')
@ApiTags('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Get(':id/orders')
  @Roles(Role.ADMIN, Role.USER)
  async findOrders(
    @Param('id') id: string,
    @Query() query: FindOrdersQueryDto,
  ) {
    const entities = await this.usersService.findOrders(id, query);
    return entities.map((entity) => plainToInstance(UserOrderDto, entity));
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.USER)
  update(
    @CurrentUser() identity: Identity,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (identity.id !== id && identity.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not allowed to update other users');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.USER)
  remove(@CurrentUser() identity: Identity, @Param('id') id: string) {
    if (identity.id !== id && identity.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not allowed to delete other users');
    }
    return this.usersService.remove(id);
  }
}
