import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/order-item.entity';
import { Product } from 'src/entities/product.entity';
import { Commune } from 'src/entities/commune.entity';
import { CreateOrderDto } from './dto/order.dto';
import { v4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Commune)
    private readonly communesRepository: Repository<Commune>,
  ) {}

  private generateId(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const getRandomLetter = () =>
      letters[Math.floor(Math.random() * letters.length)];
    const getRandomDigit = () => Math.floor(Math.random() * 10).toString();

    const id =
      getRandomLetter() +
      getRandomLetter() +
      Array.from({ length: 6 }, getRandomDigit).join('');

    return id;
  }

  private async sendNotifcation(data: Order, items: OrderItem[]): Promise<any> {
    const message = `
    📦 *Nouvelle Commande* :
    
    *Nom* : ${data.firstName} ${data.lastName}
    *Téléphone* : ${data.phoneNumber}
    *Email* : ${data.email}
    *Commune* : ${data.communeName}
    *Adresse* : ${data.address}
    *Référence* : ${data.reference}
    ${data.comment ? `*Commentaire* : ${data.comment}` : ''}

    *Produits* :
    ${items.map((item) => `• ${item.name}: (${item.quantity} x ${item.price} $)`).join('\n')}

    *Total* : ${data.total} $
    *Frais de livraison* : ${data.deliveryFees} $

    Lien de la commande : ${process.env.FRONT_URL}/orders/${data.uuid}
        `;

    const res = await fetch(process.env.WHATSAPP_API_URL, 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: "120363408467867403@g.us",
          message: message,
        }),
      })
    return await res.json();
  }

  async create(data: CreateOrderDto) {
    // Vérification de la commune
    const commune = await this.communesRepository.findOneBy({
      id: data.communeID,
    });

    if (!commune) {
      throw new NotFoundException(
        `Commune avec l'id ${data.communeID} non trouvée`,
      );
    }

    let total = 0;
    let items: OrderItem[] = [];

    // 🔄 Génération d'un `number` unique
    let number: string;
    do {
      number = this.generateId();
    } while (await this.ordersRepository.findOne({ where: { number } }));

    // Création de la commande
    const order = this.ordersRepository.create({
      uuid: v4(),
      number,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      communeName: commune.name,
      address: data.address,
      reference: data.reference,
      total: 0,
      deliveryFees: commune.deliveryFees,
      serviceFees: 0,
      comment: data.comment,
      commune,
    });

    // Sauvegarde initiale de la commande
    await this.ordersRepository.save(order);

    // Vérification et ajout des produits
    for (const item of data.items) {
      const product = await this.productsRepository.findOne({
        where: { id: item },
        relations: ['brand'],
      });

      if (!product) {
        // ⚠️ Si un produit est manquant, pas besoin de supprimer la commande, on lève juste une erreur.
        throw new NotFoundException(`Produit avec l'id ${item} non trouvé`);
      }

      total += product.price;

      const orderItem = this.orderItemsRepository.create({
        order,
        productId: product.id,
        name: product.name,
        brandName: product.brand.name,
        image: product.image,
        price: product.price,
        quantity: 1,
        total: product.price,
        size: product.size,
      });

      items.push(orderItem);
    }

    // Sauvegarde des produits
    await this.orderItemsRepository.save(items);

    // Mise à jour du total de la commande
    order.total = total;
    await this.ordersRepository.save(order);

    // Envoi de la notification
    await this.sendNotifcation(order, items);

    // Récupération et retour de la commande complète
    return await this.ordersRepository.findOne({
      where: { id: order.id },
      relations: ['items'],
    });
  }

  async findOneByUid(uuid: string) {
    return this.ordersRepository.findOne({
      where: { uuid },
      relations: ['items'],
    });
  }

  async findAll() {
    return this.ordersRepository.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }
}
