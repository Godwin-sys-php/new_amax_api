import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsInt,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsInt()
  @IsNotEmpty()
  communeID: number;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsString()
  @IsOptional()
  comment: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  items: number[];
}