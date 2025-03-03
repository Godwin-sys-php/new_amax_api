import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsInt,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Multer } from 'multer';

export class CreateCarouselDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true')
  visible: boolean;

  file: Multer.File;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Transform(({ value }) => JSON.parse(value))
  items: number[];
}

export class UpdateCarouselDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true')
  visible: boolean;

  @IsOptional()
  file?: Multer.File;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Transform(({ value }) => JSON.parse(value))
  items: number[];
}
