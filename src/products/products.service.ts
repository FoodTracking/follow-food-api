import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { Identity } from '../identity/entities/identity.entity';
import { Role } from '../auth/enum/user-role.dto';
import { ConfigService } from '@nestjs/config';
import * as fs from "fs";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
    private readonly config: ConfigService,
  ) {}

  create(
    identity: Identity,
    createProductDto: CreateProductDto,
    image: Express.Multer.File,
  ) {
    if (
      identity.role !== Role.ADMIN &&
      identity.id !== createProductDto.restaurantId
    ) {
      throw new ForbiddenException(
        'You are not allowed to create products for other restaurants',
      );
    }
    const entity = this.repository.create({
      ...createProductDto,
      image: image.filename,
    });
    return this.repository.save(entity);
  }

  async findById(id: string) {
    const entity = await this.repository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return entity;
  }

  findAll(options?: FindManyOptions<Product>) {
    return this.repository.find(options);
  }

  findOne(options: FindOneOptions) {
    return this.repository.findOne(options);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    image: Express.Multer.File,
  ) {
    const entity = await this.findById(id);
    const created = this.repository.create(updateProductDto);

    // Delete old avatar
    if (image) {
      fs.unlink(`${this.config.get('MULTER_DEST')}/${entity.image}`, () => {});
      created.image = image.filename;
    }

    return await this.repository.save({ ...entity, ...created });
  }

  remove(id: string) {
    return this.repository.softDelete(id);
  }
}
