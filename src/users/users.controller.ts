import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import {CreateUserDto, UpdateUserDto, UpdateUserPasswordDto} from "./dto/user.dto";
import {ValidateUserIdPipe} from "./pipes/users.pipe";
import {AuthGuard} from "../auth/auth.guard";
import {Role} from "../auth/role.decorator";
import {RoleGuard} from "../auth/role.guard";

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Role('admin')
    @UseGuards(RoleGuard)
    @Post()
    async create(@Body() user: CreateUserDto) {
        const data = await this.usersService.create(user)

        return {
            success: true,
            error: false,
            message: 'Utilisateur créé avec succès',
            data,
        };
    }

    @Role('admin')
    @UseGuards(RoleGuard)
    @Get()
    async getAll() {
        const data = await this.usersService.findAll()

        return {
            success: true,
            error: false,
            message: 'Liste des utilisateurs récupérée avec succès',
            data,
        };
    }

    @Role('solo')
    @UseGuards(RoleGuard)
    @Get(':id')
    async getOne(@Param('id', ValidateUserIdPipe) id: number) {
        const data = await this.usersService.findOneById(id)

        return {
            success: true,
            error: false,
            message: 'Utilisateur récupéré avec succès',
            data,
        };
    }

    @Role('admin')
    @UseGuards(RoleGuard)
    @Put(':id')
    async updateOne(@Param('id', ValidateUserIdPipe) id: number, @Body() user: UpdateUserDto) {
        const data = await this.usersService.updateOneById(id, user)

        return {
            success: true,
            error: false,
            message: 'Utilisateur modifié avec succès',
            data,
        };
    }

    @Role('admin')
    @UseGuards(RoleGuard)
    @Put(':id/password')
    async updatePassword(@Param('id', ValidateUserIdPipe) id: number, @Body() user: UpdateUserPasswordDto) {
        const data = await this.usersService.updatePassword(id, user)

        return {
            success: true,
            error: false,
            message: 'Mot de passe modifié avec succès',
            data,
        };
    }

    @Role('admin')
    @UseGuards(RoleGuard)
    @Delete(':id')
    async deleteOne(@Param('id', ValidateUserIdPipe) id: number) {
        const data = await this.usersService.deleteOneById(id)

        return {
            success: true,
            error: false,
            message: 'Utilisateur supprimé avec succès',
            data,
        };
    }

}
