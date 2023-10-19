import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}
  create(createCategoryDto: CreateCategoryDto) {
    const entity = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(entity);
  }

  findAll() {
    return this.categoriesRepository.find();
  }

  findOne(id: string) {
    return this.categoriesRepository.findOneBy({ id });
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    if (id !== updateCategoryDto.id) throw new BadRequestException();
    const entity = this.categoriesRepository.create(updateCategoryDto);
    return this.categoriesRepository.save(entity);
  }

  remove(id: string) {
    return this.categoriesRepository.softDelete(id);
  }
}
