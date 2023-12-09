import { Item } from '../Types/Item'
import {IsDefined, Min, Max, IsNotEmpty, ValidateNested} from "class-validator";

export class ItemSelectionInput {
    @IsDefined()
    @IsNotEmpty()
    @ValidateNested()
    items: Item[]

    @Min(50)
    @Max(400)
    @IsDefined()
    @IsNotEmpty()
    totalSpace: number

    constructor(input: ItemSelectionInput) {
        this.items = input.items.map(item => new Item(item));
        this.totalSpace = input.totalSpace
    }
}