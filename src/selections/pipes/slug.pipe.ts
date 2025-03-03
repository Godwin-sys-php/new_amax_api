import { PipeTransform, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SelectionsService } from '../selections.service'; // Remplacez par votre service correspondant

@Injectable()
export class ValidateSelectionSlugPipe implements PipeTransform {
    constructor(private readonly selectionsService: SelectionsService) {}

    async transform(value: string) {

        // Étape 2 : Vérifier l'existence dans la base de données
        const selection = await this.selectionsService.findOneBySlug(value);
        if (!selection) {
            throw new NotFoundException(`Selection Slug: ${value} introuvable`);
        }

        return value;
    }
}
