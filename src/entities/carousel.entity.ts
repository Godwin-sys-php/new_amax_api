import {Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import {CarouselItem} from "./carousel-item.entity";

@Entity('carousels')
export class Carousel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    position: number;

    @Column()
    userId: number;

    @Column({ length: 500 })
    userName: string;

    @Column({ length: 500 })
    image: string;

    @Column({ length: 500 })
    name: string;

    @Column({ length: 500 })
    description: string;

    @Column({ length: 500 })
    slug: string;

    @Column("boolean")
    visible: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @OneToMany(() => CarouselItem, (item) => item.carousel)
    items: CarouselItem[];
}
