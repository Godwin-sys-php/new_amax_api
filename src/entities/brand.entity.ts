import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('brands')
export class Brand {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column({ length: 500 })
    userName: string;

    @Column({ length: 500 })
    name: string;

    @Column({ length: 500 })
    image: string;

    @OneToMany(() => Product, (product) => product.brand)
    products: Product[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
