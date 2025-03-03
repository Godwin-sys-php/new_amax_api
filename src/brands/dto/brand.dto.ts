import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateBrandDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional() // Facultatif lors de la validation car l'image est ajoutée par le contrôleur
    @IsString()
    @IsUrl({}, { message: 'Image must be a valid URL' })
    image?: string;
}

export class UpdateBrandDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    @IsUrl({}, { message: 'Image must be a valid URL' })
    image?: string;
}