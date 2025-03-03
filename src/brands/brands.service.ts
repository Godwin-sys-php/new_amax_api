import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../entities/brand.entity';
import { User } from '../entities/user.entity';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto';
import * as path from "node:path";
import * as fs from "node:fs";

@Injectable()
export class BrandsService {
    constructor(
        @InjectRepository(Brand)
        private readonly brandRepository: Repository<Brand>,
    ) {}

    async create(createBrandDto: CreateBrandDto, user: User): Promise<Brand[]> {
        const brand = this.brandRepository.create({
            ...createBrandDto,
            userId: user.id,        // Ajoute l'ID utilisateur depuis le guard
            userName: user.name,    // Ajoute le nom utilisateur depuis le guard
        });
        await this.brandRepository.save(brand);
        return this.brandRepository.find();
    }

    async findAll(): Promise<Brand[]> {
        return this.brandRepository.find();
    }

    async findOneById(id: number): Promise<Brand | null> {
        return this.brandRepository.findOne({ where: { id }, relations: ['products'] });
    }

    async update(id: number, updateBrandDto: UpdateBrandDto, user: User): Promise<Brand[]> {
        if (updateBrandDto.image) {
            const brand: Brand = await this.brandRepository.findOneBy({ id: id });
            if (brand.image) {
                await this.deleteImage(brand.image);
            }
        }
        
        await this.brandRepository.update(id, {
            ...updateBrandDto,
            userId: user.id,        // Réaffecte l'utilisateur si nécessaire
            userName: user.name,    // Réaffecte le nom utilisateur si nécessaire
        });

        return this.brandRepository.find();
    }

    async deleteOneById(id: number): Promise<Brand[]> {
        const brand: Brand = await this.brandRepository.findOneBy({ id: id });
        if (brand.image) {
            await this.deleteImage(brand.image);
        }

        await this.brandRepository.delete(id);
        return this.brandRepository.find();
    }


    async deleteImage(filePath: string) {
        const fullPath: string = path.join(__dirname, '../../', filePath);
        try {
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        } catch (error) {
            console.error(`Erreur lors de la suppression de l'image : ${error.message}`);
        }
    }
}
