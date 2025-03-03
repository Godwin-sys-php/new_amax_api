import {BadRequestException, InternalServerErrorException, NotFoundException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Selection} from '../entities/selection.entity';
import {SelectionItem} from '../entities/selection-item.entity';
import {Product} from '../entities/product.entity';
import {
    CreateSelectionDto,
    ReorderSelectionDto,
    UpdateSelectionDto
} from './dto/selection.dto';
import {User} from "../entities/user.entity";

@Injectable()
export class SelectionsService {

    constructor(
        @InjectRepository(Selection)
        private readonly selectionRepository: Repository<Selection>,
        @InjectRepository(SelectionItem)
        private readonly selectionItemRepository: Repository<SelectionItem>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {
    }

    async create(data: CreateSelectionDto, user: User) {
        const selections = await this.selectionRepository.find();
        const position = selections.length ? selections[selections.length - 1].position + 1 : 1;

        const selection = this.selectionRepository.create({
            position,
            userId: user.id,
            userName: user.name,
            name: data.name,
            description: data.description,
            slug: `${data.name.replace(/\s+/g, '-').toLowerCase()}-${Math.floor(Math.random() * 1000)}`,
            visible: data.visible,
        });

        await this.selectionRepository.save(selection);

        const items: SelectionItem[] = [];

        for (const productId of data.items) {
            const product: Product = await this.productRepository.findOneBy({id: productId});

            if (!product) {
                await this.selectionRepository.remove(selection);
                throw new NotFoundException(`Produit avec l'id ${productId} non trouvé`);
            }

            const selectionItem = this.selectionItemRepository.create({
                selection,
                product
            });
            items.push(selectionItem);
        }
        await this.selectionItemRepository.save(items);

        return await this.selectionRepository.find({
            relations: ['items', 'items.product'],
            order: {
                position: 'ASC',
            },
        });
    }

    async update(id: number, data: UpdateSelectionDto, user: User) {
        const selection = await this.selectionRepository.findOneBy({ id });

        if (!selection) {
            throw new NotFoundException(`Sélection avec l'id ${id} non trouvée`);
        }

        if (selection.name !== data.name) {
            selection.slug = `${data.name.replace(/\s+/g, '-').toLowerCase()}-${Math.floor(Math.random() * 1000)}`;
        }

        // Mettre à jour les champs de la sélection
        selection.userId = user.id;
        selection.userName = user.name;
        selection.name = data.name;
        selection.description = data.description;
        selection.visible = data.visible;

        await this.selectionRepository.save(selection);

        // Gérer la mise à jour des items associés
        await this.selectionItemRepository.delete({ selection: { id } });

        const items: SelectionItem[] = [];
        for (const productId of data.items) {
            const product: Product = await this.productRepository.findOneBy({ id: productId });

            if (!product) {
                throw new NotFoundException(`Produit avec l'id ${productId} non trouvé`);
            }

            const selectionItem = this.selectionItemRepository.create({
                selection,
                product
            });
            items.push(selectionItem);
        }

        await this.selectionItemRepository.save(items);

        return await this.selectionRepository.find({
            relations: ['items', 'items.product'],
            order: {
                position: 'ASC',
            },
        });
    }

    async findAll() {
        return await this.selectionRepository.find({
            relations: ['items', 'items.product'],
            order: {
                position: 'ASC',
            },
        });
    }

    async findOneById(id: number) {
        return await this.selectionRepository.findOne({
            where: {id},
            relations: ['items', 'items.product'],
        });
    }

    async findOneBySlug(slug: string) {
        return await this.selectionRepository.findOne({
            where: {slug},
            relations: ['items', 'items.product'],
        });
    }

    async deleteOneById(id: number) {
        const selection = await this.selectionRepository.findOne({
            where: { id: id },
            relations: ['items'], // Charger les éléments liés
        });

        // Supprimer les éléments liés avant de supprimer la sélection
        if (selection.items.length > 0) {
            await this.selectionRepository.manager
                .createQueryBuilder()
                .delete()
                .from('selectionsItem')
                .where('selectionId = :id', { id })
                .execute();
        }

        // Supprimer la sélection
        await this.selectionRepository.remove(selection);

        // Retourner la liste mise à jour
        return await this.selectionRepository.find({
            relations: ['items', 'items.product'],
            order: { position: 'ASC' },
        });
    }

    async reorder(data: ReorderSelectionDto) {
        for (const [position, id] of data.positions.entries()) {
            await this.selectionRepository.update(id, { position: position + 1 });
        }

        return await this.selectionRepository.find({
            relations: ['items', 'items.product'],
            order: {
                position: 'ASC',
            },
        });
    }


}
