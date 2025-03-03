import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity('ordersItem')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, (order) => order.items)
    order: Order;

    @Column('int')
    productId: number;

    @Column({ length: 500 })
    name: string;

    @Column({ length: 500 })
    brandName: string;

    @Column({ length: 500 })
    image: string;

    @Column('float')
    price: number;

    @Column('float')
    quantity: number;

    @Column('float')
    total: number;

    @Column({ length: 500 })
    size: string;
}
