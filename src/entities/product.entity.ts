import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { Brand } from './brand.entity';
import { Category } from './category.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => Brand)
    brand: Brand;

    @ManyToOne(() => Category)
    category: Category;

    @Column({ length: 500 })
    name: string;

    @Column({ length: 500 })
    slug: string;

    @Column({ length: 500 })
    gender: string;

    @Column({ length: 500 })
    size: string;

    @Column('float')
    price: number;

    @Column({ length: 500 })
    image: string;

    @Column({ length: 500 })
    mainNote: string;

    @Column('text')
    description: string;

    @Column('boolean')
    available: boolean;
    
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
