import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';

@Entity('clients')
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    firstName: string;

    @Column({ length: 500 })
    lastName: string;

    @Column({ length: 20 })
    phoneNumber: string;

    @Column({ length: 500 })
    email: string;

    @Column({ length: 500 })
    password: string;
    
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
