import {IsEnum, IsNotEmpty, MinLength} from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsEnum(['admin', 'manager', "user"])
    type: 'admin' | 'manager' | 'user';
}

export class UpdateUserDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @IsEnum(['admin', 'manager', "user"])
    type: 'admin' | 'manager' | 'user';
}


export class UpdateUserPasswordDto {
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}