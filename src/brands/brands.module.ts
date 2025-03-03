import {Module} from '@nestjs/common';
import {BrandsService} from './brands.service';
import {BrandsController} from './brands.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Brand} from "../entities/brand.entity";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Brand]),
        AuthModule,
    ],
    providers: [BrandsService],
    controllers: [BrandsController]
})
export class BrandsModule { }
