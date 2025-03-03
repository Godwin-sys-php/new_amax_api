import {Controller, Post, UseGuards, Body, Request, Put, Param, Get, Delete} from '@nestjs/common';
import {
    CreateSelectionDto,
    ReorderSelectionDto,
    UpdateSelectionDto
} from "./dto/selection.dto";
import {User} from "../entities/user.entity";
import {AuthenticateRequestInterface} from "../commons/interfaces/authenticate-request.interface";
import {SelectionsService} from "./selections.service";
import {Role} from "../auth/role.decorator";
import {AuthGuard} from "../auth/auth.guard";
import {RoleGuard} from "../auth/role.guard";
import {ValidateProductIdPipe} from "../products/pipes/products.pipe";
import {ValidateSelectionIdPipe} from "./pipes/selections.pipe";
import {ValidateSelectionSlugPipe} from "./pipes/slug.pipe";

@Controller('selections')
export class SelectionsController {

    constructor(private readonly selectionService: SelectionsService ) {}

    @Role('admin')
    @UseGuards(AuthGuard, RoleGuard)
    @Post()
    async create(
        @Body() selection: CreateSelectionDto,
        @Request() req: AuthenticateRequestInterface
    ) {
        const user: User = req.user;

        const data = await this.selectionService.create(selection, user);

        return {
            success: true,
            error: false,
            message: 'Sélection créée avec succès',
            data,
        }
    }

    @Role('admin')
    @UseGuards(AuthGuard, RoleGuard)
    @Put(':id')
    async update(
        @Param('id', ValidateSelectionIdPipe) id: number,
        @Body() selection: UpdateSelectionDto,
        @Request() req: AuthenticateRequestInterface
    ) {
        const user: User = req.user;

        const data = await this.selectionService.update(id, selection, user);

        return {
            success: true,
            error: false,
            message: 'Sélection modifiée avec succès',
            data,
        }
    }

    @Get()
    async findAll() {
        const data = await this.selectionService.findAll();

        return {
            success: true,
            error: false,
            message: 'Liste des sélections récupérée avec succès',
            data,
        }
    }

    @Get(':slug')
    async findOne(@Param('slug', ValidateSelectionSlugPipe) slug: string) {
        const data = await this.selectionService.findOneBySlug(slug);

        return {
            success: true,
            error: false,
            message: 'Sélection récupérée avec succès',
            data,
        }
    }

    @Role('admin')
    @UseGuards(AuthGuard, RoleGuard)
    @Delete(':id/')
    async deleteOne(@Param('id', ValidateSelectionIdPipe) id: number) {
        const data = await this.selectionService.deleteOneById(id);

        return {
            success: true,
            error: false,
            message: 'Sélection supprimée avec succès',
            data,
        };
    }

    @Role("admin")
    @UseGuards(AuthGuard, RoleGuard)
    @Post("reorder")
    async reorder(@Body() positions: ReorderSelectionDto) {
        const data = await this.selectionService.reorder(positions);

        return {
            success: true,
            error: false,
            message: 'Sélections réordonnées avec succès',
            data,
        }
    }


}
