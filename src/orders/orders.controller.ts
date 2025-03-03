import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/order.dto';
import { ValidateOrderUidPipe } from './pipes/slug.pipe';
import { Role } from 'src/auth/role.decorator';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  async create(
    @Body() order: CreateOrderDto,
  ) {
    const data = await this.ordersService.create(order);

    return {
      success: true,
      error: false,
      message: 'Commande créée avec succès',
      data,
    };
  }

  @Get(':uid')
  async getOne(
    @Param('uid', ValidateOrderUidPipe) uid: string,
  ) {
    const data = await this.ordersService.findOneByUid(uid);

    return {
      success: true,
      error: false,
      message: 'Commande trouvée',
      data,
    };
  }

  @Role('admin')
  @Get()
  async getAll() {
    const data = await this.ordersService.findAll();

    return {
      success: true,
      error: false,
      message: 'Liste des commandes',
      data,
    };
  }
}
