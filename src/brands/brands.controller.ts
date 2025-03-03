import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Request,
    UseInterceptors,
    UploadedFile,
    UseGuards, Put
} from '@nestjs/common';
import {BrandsService} from './brands.service';
import {CreateBrandDto, UpdateBrandDto} from './dto/brand.dto';
import {ValidateBrandIdPipe} from './pipes/brands.pipe';
import {AuthGuard} from '../auth/auth.guard';
import {BadRequestException} from '@nestjs/common';
import {ImageFileInterceptor} from "../commons/interceptors/image-file.interceptor";
import {User} from "../entities/user.entity";
import {AuthenticateRequestInterface} from "../commons/interfaces/authenticate-request.interface";
import {Brand} from "../entities/brand.entity";
import {Role} from "../auth/role.decorator";
import {RoleGuard} from "../auth/role.guard";
import { Multer } from 'multer';

@Controller('brands')
export class BrandsController {
    constructor(private readonly brandsService: BrandsService) {
    }

    @Role('admin')
    @UseGuards(AuthGuard, RoleGuard)
    @Post()
    @UseInterceptors(ImageFileInterceptor('image', 'brands'))
    async create(
        @Request() req: AuthenticateRequestInterface,
        @UploadedFile() file: Multer.File,
        @Body() brand: CreateBrandDto,
    ) {
        const user: User = req.user; // Récupère l'utilisateur depuis le guard
        if (!file) {
            throw new BadRequestException('Une image est requise');
        }
        brand.image = `/uploads/brands/${file.filename}`; // Ajoute l'image au DTO
        const data: Brand[] = await this.brandsService.create(brand, user);

        return {
            success: true,
            error: false,
            message: 'Marque créée avec succès',
            data,
        }
    }

    @Get()
    async getAll() {
        const data: Brand[] = await this.brandsService.findAll();

        return {
            success: true,
            error: false,
            message: 'Liste des marques récupérée avec succès',
            data,
        }
    }

    @Get(':id')
    async findOne(@Param('id', ValidateBrandIdPipe) id: number) {
        const data: Brand = await this.brandsService.findOneById(id);

        return {
            success: true,
            error: false,
            message: 'Marque récupérée avec succès',
            data,
        }
    }

    @Role('admin')
    @UseGuards(AuthGuard, RoleGuard)
    @Put(':id')
    @UseInterceptors(ImageFileInterceptor('image', 'brands'))
    async update(
        @Param('id', ValidateBrandIdPipe) id: number,
        @Request() req: AuthenticateRequestInterface,
        @UploadedFile() file: Multer.File,
        @Body() updateBrandDto: UpdateBrandDto,
    ) {
        const user: User = req.user; // Récupère l'utilisateur depuis le guard
        if (file) {
            updateBrandDto.image = `/uploads/brands/${file.filename}`; // Ajoute l'image au DTO
        }
        const data: Brand[] = await this.brandsService.update(id, updateBrandDto, user);

        return {
            success: true,
            error: false,
            message: 'Marque modifiée avec succès',
            data,
        }
    }

    @Role('admin')
    @UseGuards(AuthGuard, RoleGuard)
    @Delete(':id')
    async remove(@Param('id', ValidateBrandIdPipe) id: number) {
        const data: Brand[] = await this.brandsService.deleteOneById(id);

        return {
            success: true,
            error: false,
            message: 'Marque supprimée avec succès',
            data,
        }
    }
}
