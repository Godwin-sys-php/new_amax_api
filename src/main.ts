import {ValidationPipe, BadRequestException} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {InternalServerErrorFilter} from './filters/internal-server-error.filter';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });

    // Appliquer le ValidationPipe globalement
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            exceptionFactory: (errors) => {
                const customErrors = errors.map((error: any) => ({
                    field: error.property,
                    errors: Object.values(error.constraints),
                }));
                console.log(errors)
                return new BadRequestException({
                    success: false,
                    error: true,
                    message: 'Champs invalides',
                    errors: customErrors,
                });
            },
        }),
    );

    // Appliquer le filtre pour Internal Server Errors globalement
    app.useGlobalFilters(new InternalServerErrorFilter());
    app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

    await app.listen(process.env.PORT || 3000);
}

bootstrap();
