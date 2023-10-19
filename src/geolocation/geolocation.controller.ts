import { Controller, Get, Query } from '@nestjs/common';
import { GeolocationService } from './geolocation.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('geolocation')
@ApiTags('geolocation')
export class GeolocationController {
  constructor(private readonly geoService: GeolocationService) {}

  @Get('autocomplete')
  async autocomplete(@Query('q') query: string) {
    return await this.geoService.autocomplete(query);
  }
}
