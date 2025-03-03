import { PipeTransform, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrdersService } from '../orders.service'; // Remplacez par votre service correspondant

@Injectable()
export class ValidateOrderUidPipe implements PipeTransform {
    constructor(private readonly ordersService: OrdersService) {}

    async transform(value: string) {

        // Étape 2 : Vérifier l'existence dans la base de données
        const product = await this.ordersService.findOneByUid(value);
        if (!product) {
            throw new NotFoundException(`Commande Uid: ${value} introuvable`);
        }

        return value;
    }
}
