import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { Client } from './client.entity';
import { Commune } from './commune.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Commune)
    commune: Commune;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    items: OrderItem[];

    @Column({ length: 500 })
    uuid: string;

    @Column({ length: 500 })
    number: string;

    @Column({ length: 500 })
    firstName: string;

    @Column({ length: 500 })
    lastName: string;

    @Column({ length: 500 })
    phoneNumber: string;

    @Column({ length: 500 })
    email: string;

    @Column({ length: 500 })
    communeName: string;

    @Column({ length: 500 })
    address: string;

    @Column({ length: 500 })
    reference: string;

    @Column('float')
    total: number;

    @Column('float')
    deliveryFees: number;

    @Column('float')
    serviceFees: number;

    @Column({ length: 500, nullable: true })
    comment: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
