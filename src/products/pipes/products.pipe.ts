import { PipeTransform, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductsService } from '../products.service'; // Remplacez par votre service correspondant

@Injectable()
export class ValidateProductIdPipe implements PipeTransform {
  constructor(private readonly productsService: ProductsService) {}

  async transform(value: any) {
    // Étape 1 : Vérifier et convertir en entier
    const id = parseInt(value, 10);
    if (isNaN(id)) {
      throw new BadRequestException(`Format de l'id invalide`);
    }

    // Étape 2 : Vérifier l'existence dans la base de données
    const product = await this.productsService.findOneById(id);
    if (!product) {
      throw new NotFoundException(`Produit ID: ${value} introuvable`);
    }

    return id; // Retourne l'ID en tant qu'entier valide
  }
}
