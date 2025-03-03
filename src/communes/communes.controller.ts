import {Body, Controller, Post, UseGuards, Request, Get, Put, Delete, Param} from '@nestjs/common';
import {CommunesService} from "./communes.service";
import {Role} from "../auth/role.decorator";
import {RoleGuard} from "../auth/role.guard";
import {AuthGuard} from "../auth/auth.guard";
import {AuthenticateRequestInterface} from "../commons/interfaces/authenticate-request.interface";
import {CreateAndUpdateCommuneDTO} from "./dto/commune.dto";
import {User} from "../entities/user.entity";
import {Commune} from "../entities/commune.entity";
import {ValidateCommuneIdPipe} from "./pipes/communes.pipe";

@Controller('communes')
export class CommunesController {
    constructor(private readonly communesService: CommunesService) {}

    @Role('admin')
    @UseGuards(AuthGuard, RoleGuard)
    @Post()
    async create(
        @Request() req: AuthenticateRequestInterface,
        @Body() commune: CreateAndUpdateCommuneDTO,
    ) {
        const data: Commune[] = await this.communesService.create(commune);

        return {
            success: true,
            error: false,
            message: 'Commune créée avec succès',
            data,
        }
    }

    @Get()
    async getAll() {
        console.log("tesr")
        const data: Commune[] = await this.communesService.findAll();

        console.log(data);

        return {
            success: true,
            error: false,
            message: 'Liste des communes récupérée avec succès',
            data,
        }
    }

    @Get(':id')
    async getOneById(@Param('id', ValidateCommuneIdPipe) id: number) {
        const data: Commune = await this.communesService.findOneById(id);

        return {
            success: true,
            error: false,
            message: 'Commune récupérée avec succès',
            data,
        }
    }

    @Role('admin')
    @UseGuards(AuthGuard, RoleGuard)
    @Put(':id')
    async update(
        @Request() req: AuthenticateRequestInterface,
        @Param('id', ValidateCommuneIdPipe) id: number,
        @Body() commune: CreateAndUpdateCommuneDTO,
    ) {
        const data: Commune[] = await this.communesService.update(id, commune);

        return {
            success: true,
            error: false,
            message: 'Commune modifiée avec succès',
            data,
        }
    }

    @Role('admin')
    @UseGuards(AuthGuard, RoleGuard)
    @Delete(':id')
    async delete(@Param('id', ValidateCommuneIdPipe) id: number) {
        const data: Commune[] = await this.communesService.deleteOneById(id);

        return {
            success: true,
            error: false,
            message: 'Commune supprimée avec succès',
            data,
        }
    }


}
