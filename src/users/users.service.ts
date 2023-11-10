import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { OrdersService } from '../orders/orders.service';
import { PageOptionsDto } from '../common/dto/page-options.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly orderService: OrdersService,
  ) {}

  create(createUserDto: CreateUserDto) {
    const entity = this.userRepository.create(createUserDto);
    return this.userRepository.save(entity);
  }

  findAll(options?: FindManyOptions<User>) {
    return this.userRepository.find(options);
  }

  findOrders(id: string, query: PageOptionsDto) {
    return this.orderService.findAll({
      relations: {
        products: {
          product: true,
        },
        restaurant: {
          identity: true,
        },
      },
      where: { userId: id },
      order: {
        createdAt: 'DESC',
        [query.sort]: query.order,
      },
      take: query.take,
      skip: query.skip,
    });
  }

  findOneById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  findOne(options: FindOneOptions<User>) {
    return this.userRepository.findOne(options);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.userRepository.softDelete(id);
  }
}
