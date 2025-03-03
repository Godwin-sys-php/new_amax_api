import { Module } from '@nestjs/common';
import { CommunesService } from './communes.service';
import { CommunesController } from './communes.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Commune} from "../entities/commune.entity";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([Commune]),
      AuthModule,
  ],
  providers: [CommunesService],
  controllers: [CommunesController]
})
export class CommunesModule {}
