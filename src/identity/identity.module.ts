import { Module } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { IdentityController } from './identity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Identity } from './entities/identity.entity';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '../common/multer/multer-config.service';
import { GeolocationModule } from '../geolocation/geolocation.module';

@Module({
  imports: [
    MulterModule.registerAsync({ useClass: MulterConfigService }),
    TypeOrmModule.forFeature([Identity]),
    GeolocationModule,
  ],
  controllers: [IdentityController],
  providers: [IdentityService],
  exports: [IdentityService],
})
export class IdentityModule {}
