import { PipeTransform, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CarouselsService } from '../carousels.service'; // Remplacez par votre service correspondant

@Injectable()
export class ValidateCarouselIdPipe implements PipeTransform {
  constructor(private readonly carouselsService: CarouselsService) {}

  async transform(value: any) {
    // Étape 1 : Vérifier et convertir en entier
    const id = parseInt(value, 10);
    if (isNaN(id)) {
      throw new BadRequestException(`Format de l'id invalide`);
    }

    // Étape 2 : Vérifier l'existence dans la base de données
    const carousel = await this.carouselsService.findOneById(id);
    if (!carousel) {
      throw new NotFoundException(`Caroussel ID: ${value} introuvable`);
    }

    return id; // Retourne l'ID en tant qu'entier valide
  }
}
