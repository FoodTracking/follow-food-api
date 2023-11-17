import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { FindOneOptions, In, Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { RestaurantsFindAllQueryDto } from './dto/find-all-query.dto';
import { Role } from '../auth/enum/user-role.dto';
import { Identity } from '../identity/entities/identity.entity';
import { ProductsService } from '../products/products.service';
import { OrdersService } from '../orders/orders.service';
import { FindOrdersQueryDto } from './dto/find-orders-query.dto';
import { GeolocationService } from '../geolocation/geolocation.service';
import { FindProductsQueryDto } from './dto/find-products-query.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantsRepository: Repository<Restaurant>,
    private orderService: OrdersService,
    private productsService: ProductsService,
    private geoService: GeolocationService,
  ) {}

  async create(dto: CreateRestaurantDto, user: Identity) {
    const data = await this.geoService.getGeolocation(dto.address);
    const feature = data.features[0];
    if (feature.geometry.type !== 'Point') {
      throw new BadRequestException('Invalid address');
    }

    const [long, lat] = feature.geometry.coordinates;
    const entity = this.restaurantsRepository.create({
      ...dto,
      id: user.id,
      location: { type: 'Point', coordinates: [long, lat] },
    });
    return this.restaurantsRepository.save(entity);
  }

  findAll(options?: FindManyOptions<Restaurant>) {
    return this.restaurantsRepository.find(options);
  }

  async findAllFiltered(query: RestaurantsFindAllQueryDto) {
    const builder = this.restaurantsRepository
      .createQueryBuilder('restaurant')
      .select('restaurant') // Select all fields from restaurant
      .innerJoinAndSelect('restaurant.category', 'category')
      .innerJoinAndSelect('restaurant.identity', 'identity');

    if (query.name) {
      builder.andWhere('restaurant.name ILIKE :name', {
        name: `%${query.name}%`,
      });
    }

    if (query.categories) {
      const categories = Array.isArray(query.categories)
        ? query.categories
        : [query.categories];

      builder.andWhere('category_id IN (:...categories)');
      builder.setParameter('categories', categories);
    }

    if (query.lat && query.long) {
      builder
        .addSelect(
          `ST_Distance(restaurant.location, ST_MakePoint(:longitude, :latitude)::geography)`,
          'distance',
        )
        .orderBy(`distance`)
        .setParameter('longitude', query.long)
        .setParameter('latitude', query.lat);
    }

    if (query.sort) {
      builder.addOrderBy(`restaurant.${query.sort}`, query.order ?? 'ASC');
    }

    // Pagination
    builder.take(query.take);
    builder.skip(query.skip);

    // Mapped distance to entity
    const results = await builder.getRawAndEntities();
    results.entities.forEach((entity, index) => {
      entity.distance = results.raw[index].distance;
    });

    return results.entities;
  }

  findOne(options: FindOneOptions<Restaurant>) {
    return this.restaurantsRepository.findOne(options);
  }

  findProducts(id: string, query: FindProductsQueryDto) {
    const ids = Array.isArray(query.ids) ? query.ids : [query.ids];
    return this.productsService.findAll({
      where: {
        ...(query.ids && { id: In(ids) }),
        restaurantId: id,
      },
      order: { [query.sort]: query.order },
      take: query.take,
      skip: query.skip,
    });
  }

  async findOrders(id: string, query: FindOrdersQueryDto) {
    const status = Array.isArray(query.status) ? query.status : [query.status];
    return this.orderService.findAll({
      where: {
        restaurantId: id,
        ...(query.status && { status: In(status) }),
      },
      relations: {
        products: {
          product: true,
        },
        user: {
          identity: true,
        },
      },
      order: { createdAt: 'DESC', [query.sort]: query.order },
      take: query.take,
      skip: query.skip,
      withDeleted: true,
    });
  }

  async update(id: string, dto: UpdateRestaurantDto, user: Identity) {
    const data = await this.geoService.getGeolocation(dto.address);
    const feature = data.features[0];
    if (feature.geometry.type !== 'Point') {
      throw new BadRequestException('Invalid address');
    }

    const [long, lat] = feature.geometry.coordinates;
    const entity = this.restaurantsRepository.create({
      ...dto,
      location: { type: 'Point', coordinates: [long, lat] },
    });
    await this.restaurantsRepository.update(
      {
        id,
        ...(user.role !== Role.ADMIN ? { id: user.id } : undefined),
      },
      entity,
    );

    return this.findById(id);
  }

  remove(id: string) {
    return this.restaurantsRepository.softDelete(id);
  }

  findById(id: string) {
    const entity = this.restaurantsRepository.findOne({
      relations: {
        identity: true,
      },
      where: { id },
    });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  process(id: string, approve: boolean) {
    return this.restaurantsRepository.update({ id }, { approved: approve });
  }
}
