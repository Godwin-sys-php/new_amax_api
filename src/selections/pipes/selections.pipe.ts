import { PipeTransform, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SelectionsService } from '../selections.service'; // Remplacez par votre service correspondant

@Injectable()
export class ValidateSelectionIdPipe implements PipeTransform {
  constructor(private readonly selectionsService: SelectionsService) {}

  async transform(value: any) {
    // Étape 1 : Vérifier et convertir en entier
    const id = parseInt(value, 10);
    if (isNaN(id)) {
      throw new BadRequestException(`Format de l'id invalide`);
    }

    // Étape 2 : Vérifier l'existence dans la base de données
    const selection = await this.selectionsService.findOneById(id);
    if (!selection) {
      throw new NotFoundException(`Selection ID: ${value} introuvable`);
    }

    return id; // Retourne l'ID en tant qu'entier valide
  }
}
