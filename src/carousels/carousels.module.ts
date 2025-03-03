import { Module } from '@nestjs/common';
import { CarouselsService } from './carousels.service';
import { CarouselsController } from './carousels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Carousel } from '../entities/carousel.entity';
import { CarouselItem } from '../entities/carousel-item.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Carousel, CarouselItem]),
    AuthModule,
  ],
  providers: [CarouselsService],
  controllers: [CarouselsController]
})
export class CarouselsModule {}
