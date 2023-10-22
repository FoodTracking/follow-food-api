import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { UpdateIdentityDto } from './dto/update-identity.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('identity')
@ApiTags('identity')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Get()
  findAll() {
    return this.identityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.identityService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIdentityDto: UpdateIdentityDto,
  ) {
    return this.identityService.update(id, updateIdentityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.identityService.remove(id);
  }
}
