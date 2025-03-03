import { PipeTransform, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CarouselsService } from '../carousels.service'; // Remplacez par votre service correspondant

@Injectable()
export class ValidateCarouselSlugPipe implements PipeTransform {
    constructor(private readonly carouselsService: CarouselsService) {}

    async transform(value: string) {

        // Étape 2 : Vérifier l'existence dans la base de données
        const carousel = await this.carouselsService.findOneBySlug(value);
        if (!carousel) {
            throw new NotFoundException(`Carousel Slug: ${value} introuvable`);
        }

        return value;
    }
}
