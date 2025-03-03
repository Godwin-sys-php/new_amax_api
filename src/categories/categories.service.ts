import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Category} from "../entities/category.entity";
import {Repository} from "typeorm";
import {CreateAndUpdateCategoryDTO} from "./dto/category.dto";
import {User} from "../entities/user.entity";

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ) {}

    async create(categoryDto: CreateAndUpdateCategoryDTO, user: User): Promise<Category[]> {
        const category = this.categoryRepository.create({
            ...categoryDto,
            userId: user.id,
            userName: user.name,
        });
        await this.categoryRepository.save(category);

        return this.categoryRepository.find();
    }

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    async findOneById(id: number): Promise<Category> {
        return this.categoryRepository.findOneBy({ id: id });
    }

    async update(id: number, categoryDto: CreateAndUpdateCategoryDTO): Promise<Category[]> {
        await this.categoryRepository.update(id, categoryDto);

        return this.categoryRepository.find();
    }

    async deleteOneById(id: number): Promise<Category[]> {
        await this.categoryRepository.delete(id);

        return this.categoryRepository.find();
    }
}
