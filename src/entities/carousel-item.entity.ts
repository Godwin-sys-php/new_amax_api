import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import {Carousel} from "./carousel.entity";

@Entity('carouselsItem')
export class CarouselItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Carousel)
    carousel: Carousel;
    
    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    product: Product;
}