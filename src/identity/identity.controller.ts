import {
  Body,
  Controller,
  Delete,
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

@Controller('identity')
@ApiTags('identity')
@UseGuards(JwtAuthGuard)
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Get()
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
  findOne(@Param('id') id: string) {
    return this.identityService.findOneById(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  update(
    @Param('id') id: string,
    @Body() updateIdentityDto: UpdateIdentityDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return this.identityService.update(id, updateIdentityDto, avatar);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.identityService.remove(id);
  }
}