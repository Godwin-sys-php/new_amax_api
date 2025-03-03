import {
    Controller,
    Post,
    UseGuards,
    Request,
    UseInterceptors,
    UploadedFile,
    Body,
    BadRequestException, Get, Param, Put, Delete,
    Query
} from '@nestjs/common';
import {ProductsService} from "./products.service";
import {Role} from "../auth/role.decorator";
import {AuthGuard} from "../auth/auth.guard";
import {RoleGuard} from "../auth/role.guard";
import {ImageFileInterceptor} from "../commons/interceptors/image-file.interceptor";
import {AuthenticateRequestInterface} from "../commons/interfaces/authenticate-request.interface";
import {CreateProductDto, UpdateProductDto, ValidateCartDTO} from "./dto/product.dto";
import {User} from "../entities/user.entity";
import {Product} from "../entities/product.entity";
import {ValidateProductSlugPipe} from "./pipes/slug.pipe";
import {ValidateProductIdPipe} from "./pipes/products.pipe";
import { Multer } from 'multer';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Role('admin')
    @UseGuards(AuthGuard, RoleGuard)
    @Post()
    @UseInterceptors(ImageFileInterceptor('file', 'products')) // Gestion de l'upload
    async create(
        @Request() req: AuthenticateRequestInterface,
        @UploadedFile() file: Multer.File,
        @Body() product: CreateProductDto,
    ) {
        console.log("hey")
        const user: User = req.user;

        if (file) {
            product.image = `/uploads/products/${file.filename}`;
        } else if (!product.image) {
            throw new BadRequestException('Une image (URL ou fichier) est requise');
        }

        const data = await this.productsService.create(product, user);

        return {
            success: true,
            error: false,
            message: 'Produit créé avec succès',
            data,
        };
    }

    @Post('/cart')
    async validateCart(@Body() cart: ValidateCartDTO) {
        const data = await this.productsService.validateCart(cart);

        return {
            success: true,
            error: false,
            message: 'Panier validé avec succès',
            data,
        };
    }

    @Role('admin')
    @UseGuards(AuthGuard, RoleGuard)
    @Put(':id')
    @UseInterceptors(ImageFileInterceptor('file', 'products')) // Gestion de l'upload
    async update(
        @Request() req: AuthenticateRequestInterface,
        @Param('id', ValidateProductIdPipe) id: number,
        @UploadedFile() file: Multer.File,
        @Body() product: UpdateProductDto,
    ) {
        const user: User = req.user;

        if (file) {
            product.image = `/uploads/products/${file.filename}`;
        }

        const data = await this.productsService.updateOneById(id, product, user);

        return {
            success: true,
            error: false,
            message: 'Produit modifié avec succès',
            data,
        };
    }

    @Get()
    async getAll() {
        const data= await this.productsService.findAll();

        return {
            success: true,
            error: false,
            message: 'Liste des produits récupérée avec succès',
            data,
        }
    }

    @Get(':slug')
    async getOne(@Param('slug', ValidateProductSlugPipe) slug: string) {
        const data: Product | null = await this.productsService.findOneBySlug(slug);

        return {
            success: true,
            error: false,
            message: 'Produit récupéré avec succès',
            data,
        }
    }

    @Get('/special/homepage')
    async getHomePage() {
        const data = await this.productsService.findHomePage();

        return {
            success: true,
            error: false,
            message: 'Page d\'accueil récupérée avec succès',
            data,
        }
    }

    @Get('/special/search')
    async search(@Query('q') query: string) {
        const data = await this.productsService.search(query);

        return {
            success: true,
            error: false,
            message: 'Résultat de la recherche récupérée avec succès',
            data,
        }
    }

    @Role('admin')
    @UseGuards(AuthGuard, RoleGuard)
    @Delete(':id')
    async deleteOne(@Param('id', ValidateProductIdPipe) id: number) {
        const data = await this.productsService.deleteOneById(id);

        return {
            success: true,
            error: false,
            message: 'Produit supprimé avec succès',
            data,
        };
    }
}
