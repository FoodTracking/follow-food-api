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
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IdentityService {
  constructor(
    @InjectRepository(Identity)
    private readonly identityRepository: Repository<Identity>,
    private readonly config: ConfigService,
  ) {}

  create(createUserDto: CreateIdentityDto) {
    const id = uuid();
    const entity = this.identityRepository.create({
      id: id,
      email: createUserDto.email.toLowerCase(),
      password: bcrypt.hashSync(createUserDto.password, 10),
      role: createUserDto.role,
      ...(createUserDto.role === Role.USER && {
        user: {
          id: id,
          ...createUserDto.user,
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

  async update(
    id: string,
    updateIdentityDto: UpdateIdentityDto,
    avatar?: Express.Multer.File,
  ) {
    const entity = await this.identityRepository.findOneBy({ id });
    const created = this.identityRepository.create(updateIdentityDto);

    // Delete old avatar
    if (avatar) {
      fs.unlink(`${this.config.get('MULTER_DEST')}/${entity.avatar}`, () => {});
      created.avatar = avatar.filename;
    }

    return this.identityRepository.save({ ...entity, ...created });
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
