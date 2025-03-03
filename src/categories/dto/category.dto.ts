import {IsNotEmpty} from "class-validator";


export class CreateAndUpdateCategoryDTO {
    
    @IsNotEmpty()
    name: string;

}