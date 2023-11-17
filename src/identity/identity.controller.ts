import {
  Body,
  Controller,
  Delete, ForbiddenException,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { IdentityService } from './identity.service';
import { UpdateIdentityDto } from './dto/update-identity.dto';
import { ApiTags } from '@nestjs/swagger';
import { Identity } from './entities/identity.entity';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';
import { ProfileDto } from './dto/profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enum/user-role.dto';
import { RolesGuard } from '../auth/guard/roles.guard';

@Controller('identity')
@ApiTags('identity')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.identityService.findAll();
  }

  @Get('me')
  async findMe(@CurrentUser() user: Identity) {
    const entity = await this.identityService.me(user);
    return plainToInstance(ProfileDto, entity, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.identityService.findOneById(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @CurrentUser() identity: Identity,
    @Param('id') id: string,
    @Body() updateIdentityDto: UpdateIdentityDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    if (identity.id !== id && identity.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'You are not allowed to update other identities',
      );
    }

    const entity = await this.identityService.update(
      id,
      updateIdentityDto,
      avatar,
    );

    return plainToInstance(ProfileDto, entity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.identityService.remove(id);
  }
}
