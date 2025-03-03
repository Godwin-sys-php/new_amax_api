import { PipeTransform, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductsService } from '../products.service'; // Remplacez par votre service correspondant

@Injectable()
export class ValidateProductSlugPipe implements PipeTransform {
    constructor(private readonly productsService: ProductsService) {}

    async transform(value: string) {

        // Étape 2 : Vérifier l'existence dans la base de données
        const product = await this.productsService.findOneBySlug(value);
        if (!product) {
            throw new NotFoundException(`Produit Slug: ${value} introuvable`);
        }

        return value;
    }
}
