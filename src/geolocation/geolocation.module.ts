import { Module } from '@nestjs/common';
import { GeolocationService } from './geolocation.service';
import { GeolocationController } from './geolocation.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [GeolocationService],
  exports: [GeolocationService],
  controllers: [GeolocationController],
})
export class GeolocationModule {}
