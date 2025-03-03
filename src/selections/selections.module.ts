import { Module } from '@nestjs/common';
import { SelectionsService } from './selections.service';
import { SelectionsController } from './selections.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";
import {Product} from "../entities/product.entity";
import {Selection} from "../entities/selection.entity";
import {SelectionItem} from "../entities/selection-item.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Selection, SelectionItem]),
    AuthModule,  
  ],
  providers: [SelectionsService],
  controllers: [SelectionsController]
})
export class SelectionsModule {}
