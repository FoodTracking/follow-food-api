import { Injectable } from '@nestjs/common';
import { CreateIdentityDto } from './dto/create-identity.dto';
import { UpdateIdentityDto } from './dto/update-identity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Identity } from './entities/identity.entity';
import { FindOneOptions, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { Role } from '../auth/enum/user-role.dto';

@Injectable()
export class IdentityService {
  constructor(
    @InjectRepository(Identity)
    private readonly identityRepository: Repository<Identity>,
  ) {}

  create(createUserDto: CreateIdentityDto) {
    const id = uuid();
    const entity = this.identityRepository.create({
      id: id,
      email: createUserDto.email.toLowerCase(),
      password: bcrypt.hashSync(createUserDto.password, 10),
      ...(createUserDto.role === Role.USER && {
        client: {
          id: id,
          ...createUserDto.client,
        },
      }),
      ...(createUserDto.role === Role.RESTAURANT && {
        restaurant: {
          id: id,
          ...createUserDto.restaurant,
        },
      }),
    });
    return this.identityRepository.save(entity);
  }

  findAll(options?: FindManyOptions<Identity>) {
    return this.identityRepository.find(options);
  }

  findOneById(id: string) {
    return this.identityRepository.findOneBy({ id });
  }

  findOne(options: FindOneOptions) {
    return this.identityRepository.findOne(options);
  }

  update(
    id: string,
    updateIdentityDto: UpdateIdentityDto,
    avatar?: Express.Multer.File,
  ) {
    const entity = this.identityRepository.create({
      ...updateIdentityDto,
      avatar: avatar?.filename,
    });
    return this.identityRepository.update(id, entity);
  }

  remove(id: string) {
    return `This action removes a #${id} identity`;
  }

  async me(identity: Identity) {
    const entity = await this.identityRepository.findOne({
      relations: {
        user: true,
        restaurant: true,
      },
      where: { id: identity.id },
    });

    return entity;
  }
}
