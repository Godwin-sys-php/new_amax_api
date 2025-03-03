import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Selection } from './selection.entity';
import { Product } from './product.entity';

@Entity('selectionsItem')
export class SelectionItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Selection)
    selection: Selection;
    
    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    product: Product;
}
