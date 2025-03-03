import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Carousel } from '../entities/carousel.entity';
import { Repository } from 'typeorm';
import { CarouselItem } from '../entities/carousel-item.entity';
import { Product } from '../entities/product.entity';
import { CreateCarouselDto, UpdateCarouselDto } from './dto/carousel.dto';
import { User } from '../entities/user.entity';
import * as path from 'node:path';
import * as fs from 'node:fs';

@Injectable()
export class CarouselsService {
  constructor(
    @InjectRepository(Carousel)
    private readonly carouselRepository: Repository<Carousel>,
    @InjectRepository(CarouselItem)
    private readonly carouselItemRepository: Repository<CarouselItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(data: CreateCarouselDto, user: User, imageUrl: string) {
    const carousels = await this.carouselRepository.find();
    const position = carousels.length
      ? carousels[carousels.length - 1].position + 1
      : 1;
    const carousel = this.carouselRepository.create({
      position,
      userId: user.id,
      userName: user.name,
      name: data.name,
      description: data.description,
      slug: `${data.name.replace(/\s+/g, '-').toLowerCase()}-${Math.floor(Math.random() * 1000)}`,
      image: imageUrl,
      visible: data.visible,
    });

    await this.carouselRepository.save(carousel);

    for (const productId of data.items) {
      const product: Product = await this.productRepository.findOneBy({
        id: productId,
      });

      if (!product) {
        await this.carouselRepository.remove(carousel);
        throw new NotFoundException(
          `Produit avec l'id ${productId} non trouvé`,
        );
      }

      const carouselItem = this.carouselItemRepository.create({
        carousel,
        product: product,
      });

      await this.carouselItemRepository.save(carouselItem);
    }

    return await this.carouselRepository.find({
      relations: ['items', 'items.product'],
      order: { position: 'ASC' },
    });
  }

  async update(
    id: number,
    data: UpdateCarouselDto,
    user: User,
    imageUrl?: string,
  ) {
    const carousel = await this.carouselRepository.findOneBy({ id: id });

    if (!carousel) {
      throw new NotFoundException(`Carousel avec l'id ${id} non trouvé`);
    }

    if (carousel.name !== data.name) {
      carousel.slug = `${data.name.replace(/\s+/g, '-').toLowerCase()}-${Math.floor(Math.random() * 1000)}`;
    }

    carousel.userId = user.id;
    carousel.userName = user.name;
    carousel.name = data.name;
    carousel.description = data.description;
    carousel.visible = data.visible;

    if (imageUrl) {
      if (
        carousel.image &&
        carousel.image.startsWith('/uploads/') &&
        imageUrl !== carousel.image
      ) {
        await this.deleteImage(carousel.image);
      }
      carousel.image = imageUrl;
    }

    await this.carouselRepository.save(carousel);

    await this.carouselItemRepository.delete({ carousel: { id } });

    const items: CarouselItem[] = [];
    for (const productId of data.items) {
      const product: Product = await this.productRepository.findOneBy({
        id: productId,
      });

      if (!product) {
        throw new NotFoundException(
          `Produit avec l'id ${productId} non trouvé`,
        );
      }

      const selectionItem = this.carouselItemRepository.create({
        carousel,
        product,
      });
      items.push(selectionItem);
    }

    await this.carouselItemRepository.save(items);

    return await this.carouselRepository.find({
      relations: ['items', 'items.product'],
      order: { position: 'ASC' },
    });
  }

  async findAll() {
    return await this.carouselRepository.find({
      relations: ['items', 'items.product'],
      order: { position: 'ASC' },
    });
  }

  async findOneById(id: number) {
    return this.carouselRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
  }

  async findOneBySlug(slug: string) {
    return this.carouselRepository.findOne({
      where: { slug },
      relations: ['items', 'items.product', 'items.product.brand', 'items.product.category'],
    });
  }

  async deleteOneById(id: number) {
    const carousel = await this.carouselRepository.findOne({
      where: { id: id },
      relations: ['items'], // Charger les éléments liés
    });
    if (carousel.image) {
      await this.deleteImage(carousel.image);
    }

    if (carousel.items.length > 0) {
      await this.carouselRepository.manager
        .createQueryBuilder()
        .delete()
        .from('carouselsItem')
        .where('carouselId = :id', { id })
        .execute();
    }

    // Supprimer la sélection
    await this.carouselRepository.remove(carousel);

    // Retourner la liste mise à jour
    return await this.carouselRepository.find({
      relations: ['items', 'items.product'],
      order: { position: 'ASC' },
    });
  }

  async deleteImage(filePath: string) {
    const fullPath: string = path.join(__dirname, '../../', filePath);
    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      console.error(
        `Erreur lors de la suppression de l'image : ${error.message}`,
      );
    }
  }
}
