import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { v4 as uuid } from 'uuid';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { Identity } from '../identity/entities/identity.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
  ) {}

  create(identity: Identity, createOrderDto: CreateOrderDto) {
    const id = uuid();
    const products: Partial<OrderItem>[] = createOrderDto.products.map(
      (product) => ({
        orderId: id,
        productId: product.productId,
        quantity: product.quantity,
      }),
    );
    const entity: Order = this.repository.create({
      id,
      restaurantId: createOrderDto.restaurantId,
      userId: identity.id,
      products,
    });
    return this.repository.save(entity);
  }

  findAll(options?: FindManyOptions<Order>) {
    return this.repository.find(options);
  }

  findOne(options: FindOneOptions<Order>) {
    return this.repository.findOne(options);
  }

  findById(id: string) {
    const entity = this.repository.findOneBy({ id });
    if (!entity) throw new NotFoundException('Order not found');
    return entity;
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    const entity = this.repository.create(updateOrderDto);
    return this.repository.update({ id }, entity);
  }

  remove(id: string) {
    return this.repository.softDelete({ id });
  }
}
