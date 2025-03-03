import {Controller, Post, UseGuards, Request, Body, Get, Put, Param, Delete} from '@nestjs/common';
import {CategoriesService} from "./categories.service";
import {Role} from "../auth/role.decorator";
import {AuthGuard} from "../auth/auth.guard";
import {RoleGuard} from "../auth/role.guard";
import {AuthenticateRequestInterface} from "../commons/interfaces/authenticate-request.interface";
import {CreateAndUpdateCategoryDTO} from "./dto/category.dto";
import {User} from "../entities/user.entity";
import {ValidateCategoryIdPipe} from "./pipes/categories.pipe";

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Role('admin')
    @UseGuards(AuthGuard, RoleGuard)
    @Post()
    async create(
        @Request() req: AuthenticateRequestInterface,
        @Body() category: CreateAndUpdateCategoryDTO,
    ) {
        const user: User = req.user;
        const data = await this.categoriesService.create(category, user);

        return {
            success: true,
            error: false,
            message: 'Catégorie créée avec succès',
            data,
        }
    }

    // get all categories (not protected)
    @Get()
    async getAll() {
        const data = await this.categoriesService.findAll();

        return {
            success: true,
            error: false,
            message: 'Liste des categories récupérée avec succès',
            data,
        }
    }

    @Get(':id')
    async getOneById(@Param('id', ValidateCategoryIdPipe) id: number) {
        const data = await this.categoriesService.findOneById(id);

        return {
            success: true,
            error: false,
            message: 'Catégorie récupérée avec succès',
            data,
        }
    }

    @Role('admin')
    @UseGuards(AuthGuard, RoleGuard)
    @Put(':id')
    async update(
        @Body() category: CreateAndUpdateCategoryDTO,
        @Param ('id', ValidateCategoryIdPipe) id: number,
    ) {
        const data = await this.categoriesService.update(id, category);

        return {
            success: true,
            error: false,
            message: 'Catégorie modifiée avec succès',
            data,
        }
    }

    @Role('admin')
    @UseGuards(AuthGuard, RoleGuard)
    @Delete(':id')
    async deleteOneById(@Param('id', ValidateCategoryIdPipe) id: number) {
        const data = await this.categoriesService.deleteOneById(id);

        return {
            success: true,
            error: false,
            message: 'Catégorie supprimée avec succès',
            data,
        }
    }



}
