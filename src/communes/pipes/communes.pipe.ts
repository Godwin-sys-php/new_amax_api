import { PipeTransform, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {CommunesService} from "../communes.service"; // Remplacez par votre service correspondant

@Injectable()
export class ValidateCommuneIdPipe implements PipeTransform {
  constructor(private readonly communesService: CommunesService) {}

  async transform(value: any) {
    // Étape 1 : Vérifier et convertir en entier
    const id = parseInt(value, 10);
    if (isNaN(id)) {
      throw new BadRequestException(`Format de l'id invalide`);
    }

    // Étape 2 : Vérifier l'existence dans la base de données
    const commune = await this.communesService.findOneById(id);
    if (!commune) {
      throw new NotFoundException(`Commune ID: ${value} introuvable`);
    }

    return id; // Retourne l'ID en tant qu'entier valide
  }
}
