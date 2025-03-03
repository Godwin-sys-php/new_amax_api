import { PipeTransform, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BrandsService } from '../brands.service'; // Remplacez par votre service correspondant

@Injectable()
export class ValidateBrandIdPipe implements PipeTransform {
  constructor(private readonly brandsService: BrandsService) {}

  async transform(value: any) {
    // Étape 1 : Vérifier et convertir en entier
    const id = parseInt(value, 10);
    if (isNaN(id)) {
      throw new BadRequestException(`Format de l'id invalide`);
    }

    // Étape 2 : Vérifier l'existence dans la base de données
    const brand = await this.brandsService.findOneById(id);
    if (!brand) {
      throw new NotFoundException(`Marque ID: ${value} introuvable`);
    }

    return id; // Retourne l'ID en tant qu'entier valide
  }
}
