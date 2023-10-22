import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Client)
    private readonly userRepository: Repository<Client>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const entity = this.userRepository.create(createUserDto);
    return this.userRepository.save(entity);
  }

  findAll(options?: FindManyOptions<Client>) {
    return this.userRepository.find(options);
  }

  findOneById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  findOne(options: FindOneOptions<Client>) {
    return this.userRepository.findOne(options);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.userRepository.softDelete(id);
  }
}
