import {BadRequestException, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../entities/user.entity";
import {CreateUserDto, UpdateUserDto,UpdateUserPasswordDto} from "./dto/user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    hashPassword(password: string): string {
        return bcrypt.hashSync(password, 10)
    }

    async create(data: CreateUserDto): Promise<User[]> {
        const checkUname = await this.usersRepository.findOneBy({ username: data.username });

        if (checkUname) {
            throw new BadRequestException('Le nom d\'utilisateur existe déjà');
        }

        const user = this.usersRepository.create({
            name: data.name,
            username: data.username,
            type: data.type,
            password: this.hashPassword(data.password),
        });

        await this.usersRepository.save(user);

        return this.usersRepository.find();
    }

    async findByUsername(username: string): Promise<User | null> {
        console.log('Searching for user with username:', username);
        return this.usersRepository.findOneBy({ username });
    }


    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOneById(id: number): Promise<User> {
        return this.usersRepository.findOneBy({ id: id, });
    }

    async updateOneById(id: number, data: UpdateUserDto): Promise<User[]> {
        const checkUname = await this.usersRepository.findOneBy({ username: data.username });

        if (checkUname) {
            throw new BadRequestException('Le nom d\'utilisateur existe déjà');
        }
        await this.usersRepository.update(id, data);
        return this.usersRepository.find();
    }

    async updatePassword(id: number, data: UpdateUserPasswordDto): Promise<User[]> {
        const user = await this.usersRepository.findOneBy({ id: id });
        user.password = this.hashPassword(data.password);
        return this.usersRepository.find();
    }

    async deleteOneById(id: number): Promise<User[]> {
        await this.usersRepository.delete(id);
        return this.usersRepository.find();
    }



}
