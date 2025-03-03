import { PipeTransform, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users.service'; // Remplacez par votre service correspondant

@Injectable()
export class ValidateUserIdPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}

  async transform(value: any) {
    // Étape 1 : Vérifier et convertir en entier
    const id = parseInt(value, 10);
    if (isNaN(id)) {
      throw new BadRequestException(`Format de l'id invalide`);
    }

    // Étape 2 : Vérifier l'existence dans la base de données
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException(`Utilisateur ID: ${value} introuvable`);
    }

    return id; // Retourne l'ID en tant qu'entier valide
  }
}
