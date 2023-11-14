import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { ProductDto } from './dto/product.dto';
import { Role } from '../auth/enum/user-role.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { Identity } from '../identity/entities/identity.entity';
import { RolesGuard } from '../auth/guard/roles.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('products')
@ApiTags('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RESTAURANT)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @CurrentUser() identity: Identity,
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.productsService.create(identity, createProductDto, image);
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll() {
    const entities = await this.productsService.findAll();
    return entities.map((entity) => plainToInstance(ProductDto, entity));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const entity = await this.productsService.findById(id);
    return plainToInstance(ProductDto, entity);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.RESTAURANT)
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const entity = this.productsService.update(id, updateProductDto, image);
    return plainToInstance(ProductDto, entity);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.RESTAURANT)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
