import {IsNotEmpty, IsNumber, Min} from "class-validator";


export class CreateAndUpdateCommuneDTO {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    deliveryFees: number;

}