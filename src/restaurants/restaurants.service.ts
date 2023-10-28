import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { RestaurantsFindAllQueryDto } from './dto/find-all-query.dto';
import { Role } from '../auth/enum/user-role.dto';
import { Identity } from '../identity/entities/identity.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantsRepository: Repository<Restaurant>,
  ) {}

  create(createRestaurantDto: CreateRestaurantDto, user: Identity) {
    const entity = this.restaurantsRepository.create({
      ...createRestaurantDto,
      id: user.id,
    });
    return this.restaurantsRepository.save(entity);
  }

  findAll(options?: FindManyOptions<Restaurant>) {
    return this.restaurantsRepository.find(options);
  }

  findAllFiltered(query: RestaurantsFindAllQueryDto) {
    const builder = this.restaurantsRepository
      .createQueryBuilder('restaurant')
      .select();

    if (query.name) {
      builder.andWhere('name ILIKE :name', { name: `%${query.name}%` });
    }

    if (query.category) {
      builder.innerJoinAndSelect('restaurant.category', 'category');
      builder.andWhere('category_id = :category', { category: query.category });
    }

    if (query.lat && query.long && query.radius) {
      builder
        .andWhere(
          `ST_DWithin(restaurant.location, ST_MakePoint(:longitude, :latitude)::geography, :radius)`,
        )
        .orderBy(
          `ST_Distance(restaurant.location, ST_MakePoint(:longitude, :latitude)::geography)`,
        )
        .setParameter('longitude', query.long)
        .setParameter('latitude', query.lat)
        .setParameter('radius', query.radius);
    }

    return builder.getMany();
  }

  findOne(options: FindOneOptions<Restaurant>) {
    return this.restaurantsRepository.findOne(options);
  }

  async update(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
    user: Identity,
  ) {
    if (id !== updateRestaurantDto.id) throw new BadRequestException();
    const entity = this.restaurantsRepository.create(updateRestaurantDto);
    await this.restaurantsRepository.update(
      {
        id,
        ...(user.role !== Role.ADMIN ? { ownerId: user.id } : undefined),
      },
      entity,
    );

    return this.findById(id);
  }

  remove(id: string) {
    return this.restaurantsRepository.softDelete(id);
  }

  findById(id: string) {
    const entity = this.restaurantsRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  process(id: string, approve: boolean) {
    return this.restaurantsRepository.update({ id }, { approved: approve });
  }
}
