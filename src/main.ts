import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Setup app
  app.disable('x-powered-by');

  // Static files
  const config = app.get<ConfigService>(ConfigService);
  app.useStaticAssets(config.get('MULTER_DEST'), { prefix: '/public' });

  // Swagger
  const builder = new DocumentBuilder()
    .setTitle('Follow-Food API')
    .addBearerAuth()
    .setDescription('The official API for Follow-Food')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, builder);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
