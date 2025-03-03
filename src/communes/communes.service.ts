import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Commune} from "../entities/commune.entity";
import {Repository} from "typeorm";
import {CreateAndUpdateCommuneDTO} from "./dto/commune.dto";
import {User} from "../entities/user.entity";

@Injectable()
export class CommunesService {
    constructor(
        @InjectRepository(Commune)
        private readonly communesRepository: Repository<Commune>
    ) { }

    async create(data: CreateAndUpdateCommuneDTO) {
        const commune = this.communesRepository.create(data);
        await this.communesRepository.save(commune);
        return this.communesRepository.find();
    }

    async findAll() {
        return this.communesRepository.find();
    }

    async findOneById(id: number) {
        return this.communesRepository.findOne({ where: { id } });
    }

    async update(id: number, data: CreateAndUpdateCommuneDTO) {
        await this.communesRepository.update(id, data);
        return this.communesRepository.find();
    }

    async deleteOneById(id: number) {
        await this.communesRepository.delete(id);
        return this.communesRepository.find();
    }

}
