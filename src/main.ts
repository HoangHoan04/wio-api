import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters';
import { dataSource } from './typeorm';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api', {
    exclude: ['health', '/'],
  });

  const environment = configService.get<string>('NODE_ENV') || 'development';
  const configuredOrigins = (configService.get<string>('CORS_ORIGINS') || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const developmentOrigins = [
    'http://localhost:2504',
    'http://localhost:3005',
    'http://localhost:3000',
  ];
  const allowedOrigins =
    configuredOrigins.length > 0 ? configuredOrigins : developmentOrigins;

  app.enableCors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS origin not allowed: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'X-Request-Id'],
  });
  if (configService.get<string>('TRUST_PROXY') === 'true') {
    app.getHttpAdapter().getInstance().set('trust proxy', 1);
  }
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (environment === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  addTransactionalDataSource(dataSource);

  const options = new DocumentBuilder()
    .setTitle('Wio API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  if (
    environment !== 'production' ||
    configService.get<string>('ENABLE_SWAGGER') === 'true'
  ) {
    SwaggerModule.setup('api-docs', app, document);
  }

  const port = parseInt(
    process.env.PORT || configService.get('PORT') || '4300',
    10,
  );

  await app.listen(port);

  console.log('='.repeat(50));
  console.log(`Application started successfully!`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Listening on: http://localhost:${port}`);
  console.log(`Health Check: http://localhost:${port}/health`);
  console.log(`API Docs: http://localhost:${port}/api-docs`);
  console.log(`API Endpoints: http://localhost:${port}/api/*`);
  console.log('='.repeat(50));
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
