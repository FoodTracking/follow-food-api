import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { SocketIoAdapter } from './common/socket-io.adapter';
import { json as expressJson, urlencoded as expressUrlEncoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Setup app
  app.disable('x-powered-by');
  // the next two lines did the trick
  app.use(expressJson({ limit: '50mb' }));
  app.use(expressUrlEncoded({ limit: '50mb', extended: true }));

  // Static files
  const config = app.get<ConfigService>(ConfigService);
  app.useStaticAssets(config.get('MULTER_DEST'), { prefix: '/public' });
  app.useWebSocketAdapter(new SocketIoAdapter(app));

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
