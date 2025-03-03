import {IsNotEmpty, IsString, IsNumber, IsArray, ArrayNotEmpty, IsInt, IsBoolean} from 'class-validator';

export class CreateSelectionDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsBoolean()
    visible: boolean;

    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    items: number[];
}

export class UpdateSelectionDto extends CreateSelectionDto { }

export class ReorderSelectionDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    positions: number[];
}