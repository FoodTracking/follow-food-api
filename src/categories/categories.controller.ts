import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes,} from '@nestjs/common';
import {CategoriesService} from './categories.service';
import {CreateCategoryDto, createCategorySchema,} from './dto/create-category.dto';
import {UpdateCategoryDto, updateCategorySchema,} from './dto/update-category.dto';
import {ZodValidationPipe} from "../common/pipes/zod.pipe";
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";
import {RolesGuard} from "../auth/guard/roles.guard";
import {Roles} from "../auth/decorator/roles.decorator";
import {Role} from "../auth/enum/user-role.dto";

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UsePipes(new ZodValidationPipe(createCategorySchema))
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @UsePipes(new ZodValidationPipe(updateCategorySchema))
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
