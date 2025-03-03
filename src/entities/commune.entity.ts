import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('communes')
export class Commune {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    name: string;

    @Column('float')
    deliveryFees: number;
}
