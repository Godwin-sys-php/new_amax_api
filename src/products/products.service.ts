import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository, Like, } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Brand } from '../entities/brand.entity';
import { CreateProductDto, UpdateProductDto, ValidateCartDTO } from './dto/product.dto';
import { User } from '../entities/user.entity';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { Carousel } from 'src/entities/carousel.entity';
import { Selection } from 'src/entities/selection.entity';
import { Commune } from 'src/entities/commune.entity';
import { log } from 'node:console';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Commune)
    private readonly communesRepository: Repository<Commune>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,
    @InjectRepository(Selection)
    private readonly selectionRepository: Repository<Selection>,
    @InjectRepository(Carousel)
    private readonly carouselRepository: Repository<Carousel>,
  ) {}

  async create(data: CreateProductDto, user: User) {
    const category = await this.categoriesRepository.findOneBy({
      id: data.categoryId,
    });
    const brand = await this.brandsRepository.findOneBy({ id: data.brandId });

    if (!category || !brand) {
      throw new BadRequestException('Catégorie ou marque introuvable');
    }

    const product = this.productsRepository.create({
      ...data,
      slug: `${data.name.replace(/\s+/g, '-').toLowerCase()}-${Math.floor(Math.random() * 1000)}`,
      userId: user.id,
      category,
      brand,
    });

    await this.productsRepository.save(product);

    return {
      categories: await this.categoriesRepository.find(),
      brands: await this.brandsRepository.find(),
      products: await this.productsRepository.find({
        relations: ['category', 'brand'],
      }),
    };
  }

  async updateOneById(id: number, data: UpdateProductDto, user: User) {
    const category = await this.categoriesRepository.findOneBy({
      id: data.categoryId,
    });
    const brand = await this.brandsRepository.findOneBy({ id: data.brandId });

    if (!category || !brand) {
      throw new BadRequestException('Catégorie ou marque introuvable');
    }

    const product = await this.productsRepository.findOneBy({ id: id });

    if (
      data.image &&
      product.image &&
      product.image.startsWith('/uploads/') &&
      data.image !== product.image
    ) {
      // Suppression du fichier téléversé précédent si remplacé par un nouvel upload ou une URL
      const fullPath = path.join(__dirname, '../../', product.image);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    const { categoryId, brandId, ...filteredData } = data;

    const updateData =
      product.name !== data.name
        ? {
            ...filteredData,
            slug: `${data.name.replace(/\s+/g, '-').toLowerCase()}-${Math.floor(Math.random() * 1000)}`,
            userId: user.id,
            category,
            brand,
          }
        : {
            ...filteredData,
            userId: user.id,
            category,
            brand,
          };

    await this.productsRepository.update(id, updateData);

    return {
      categories: await this.categoriesRepository.find(),
      brands: await this.brandsRepository.find(),
      products: await this.productsRepository.find({
        relations: ['category', 'brand'],
      }),
    };
  }

  async findAll() {
    return {
      categories: await this.categoriesRepository.find(),
      brands: await this.brandsRepository.find(),
      products: await this.productsRepository.find({
        relations: ['category', 'brand'],
      }),
    };
  }

  async search(query: string) {
    return this.productsRepository.find({
      where: [
        { name: Like(`%${query}%`) },
        { brand: { name: Like(`%${query}%`) } },
        { category: { name: Like(`%${query}%`) } },
      ],
      relations: ['brand', 'category'],
    });
  }

  async findOneById(id: number) {
    return this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'brand'],
    });
  }

  async findOneBySlug(slug: string) {
    return this.productsRepository.findOne({
      where: { slug },
      relations: ['category', 'brand'],
    });
  }

  async findHomePage() {
    const carousels = await this.carouselRepository.find({
      where: { visible: true },
      relations: ['items', 'items.product'],
      order: { position: 'ASC' },
    });
    const selections = await this.selectionRepository.find({
      where: { visible: true },
      relations: ['items', 'items.product', 'items.product.category', 'items.product.brand'],
      order: { position: 'ASC' },
    });
    const brands = await this.brandsRepository.find();

    return {
      carousels,
      selections,
      brands,
    };
  }

  async validateCart(data: ValidateCartDTO) {
    let errors = [];
    let finalsArray = [];
    for (const item of data.items) {
      const product = await this.productsRepository.findOne({ where: {id: item.id}, relations: ['category', 'brand'] });
      console.log(product);
      
      if (!product) {
        errors.push(`Le produit suivant n'existe plus et a été retiré du panier : ${item.name}`);
        continue;
      } else if (product.available === false) {
        errors.push(`Le produit ${item.name} n'est plus disponible et a été retiré du panier`);
        continue;
      } else {
        console.log(product.price, item.price);
        if (product.price !== item.price) {
          errors.push(
            `Le prix du produit ${item.name} a changé de $${item.price} à $${product.price}`,
          );
        }
        if (product.name !== item.name) {
          errors.push(
            `Le nom du produit ${item.name} a changé pour ${product.name}`,
          );
        }
        finalsArray.push(product);
      }
    }

    console.log(errors);
    

    const communes = await this.communesRepository.find();

    return {
      errors,
      items: finalsArray,
      communes,
    };
  }

  async deleteOneById(id: number) {
    const product = await this.productsRepository.findOneBy({ id: id });
    if (product.image) {
      await this.deleteImage(product.image);
    }

    await this.productsRepository.delete(id);
    return {
      categories: await this.categoriesRepository.find(),
      brands: await this.brandsRepository.find(),
      products: await this.productsRepository.find({
        relations: ['category', 'brand'],
      }),
    };
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
