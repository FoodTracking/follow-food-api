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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../auth/enum/user-role.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { plainToInstance } from 'class-transformer';
import { UserOrderDto } from './dto/user-order.dto';

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
  async findOrders(@Param('id') id: string, @Query() query: PageOptionsDto) {
    const entities = await this.usersService.findOrders(id, query);
    return entities.map((entity) => plainToInstance(UserOrderDto, entity));
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.USER)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.USER)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
