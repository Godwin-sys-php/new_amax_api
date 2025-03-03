import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Product} from "../entities/product.entity";
import {Category} from "../entities/category.entity";
import {Brand} from "../entities/brand.entity";
import {AuthModule} from "../auth/auth.module";
import { Carousel } from 'src/entities/carousel.entity';
import { Selection } from 'src/entities/selection.entity';
import { Commune } from 'src/entities/commune.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Product, Category, Brand, Carousel, Selection, Commune]),
      AuthModule,
  ],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule {}
