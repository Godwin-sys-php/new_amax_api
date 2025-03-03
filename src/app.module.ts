import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';
import { CommunesModule } from './communes/communes.module';
import { ProductsModule } from './products/products.module';
import { SelectionsModule } from './selections/selections.module';
import { CarouselsModule } from './carousels/carousels.module';
import { OrdersModule } from './orders/orders.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    UsersModule,
    AuthModule,
    BrandsModule,
    CategoriesModule,
    CommunesModule,
    ProductsModule,
    SelectionsModule,
    CarouselsModule,
    OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
