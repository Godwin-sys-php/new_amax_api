import { IsNotEmpty, IsNumber, IsString, IsBoolean, IsOptional, IsUrl, ValidateIf, IsInt, IsPositive, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Multer } from 'multer';

export class CreateProductDto {
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    brandId: number;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    categoryId: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    gender: string;

    @IsNotEmpty()
    @IsString()
    size: string;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    price: number;

    @IsString()
    mainNote: string;

    @IsString()
    description: string;

    @IsNotEmpty()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    available: boolean;

    @IsOptional()
    @IsString()
    @IsUrl({}, { message: 'L\'image doit être une URL valide si elle est fournie' })
    @ValidateIf((o) => !o.file) // Valider si aucun fichier n'est fourni
    image?: string;

    @IsOptional()
    file?: Multer.File; // Représente le fichier téléversé
}

export class UpdateProductDto extends CreateProductDto {}

class ItemDto {
    @IsInt()
    @IsPositive()
    id: number;
  
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsNumber()
    @IsPositive()
    price: number;
  }
  
  export class ValidateCartDTO {
    @ValidateNested({ each: true }) // Valide chaque élément de la liste
    @Type(() => ItemDto) // Nécessaire pour transformer correctement les objets
    items: ItemDto[];
  }