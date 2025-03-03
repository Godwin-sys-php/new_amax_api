import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/order-item.entity';
import { Product } from 'src/entities/product.entity';
import { Commune } from 'src/entities/commune.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Order, OrderItem, Commune]),
    AuthModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
