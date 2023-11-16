import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { v4 as uuid } from 'uuid';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { Identity } from '../identity/entities/identity.entity';
import { OrdersGateway } from './orders.gateway';
import { OrderStatusEnum } from './entities/order-status.enum';
import { EnumX } from '../utils/enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
    private readonly orderGateway: OrdersGateway,
  ) {}

  async create(identity: Identity, createOrderDto: CreateOrderDto) {
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

    const saved = await this.repository.save(entity);
    const created = await this.findOne({
      where: { id: saved.id },
      relations: {
        products: {
          product: true,
        },
      },
    });
    this.orderGateway.newOrder(createOrderDto.restaurantId, created);
    return saved;
  }

  findAll(options?: FindManyOptions<Order>) {
    return this.repository.find(options);
  }

  findOne(options: FindOneOptions<Order>) {
    return this.repository.findOne(options);
  }

  findById(id: string) {
    const entity = this.repository.findOne({
      relations: {
        products: {
          product: true,
        },
        restaurant: {
          identity: true,
        },
      },
      where: { id },
    });
    if (!entity) throw new NotFoundException('Order not found');
    return entity;
  }

  async next(id: string) {
    const entity = await this.repository.findOneBy({ id });
    const nextStatus = EnumX.of(OrderStatusEnum).next(entity.status);

    entity.status = nextStatus ?? entity.status;
    this.orderGateway.updateOrder(entity.restaurantId, entity);
    return this.repository.save(entity);
  }

  remove(id: string) {
    return this.repository.softDelete({ id });
  }
}
