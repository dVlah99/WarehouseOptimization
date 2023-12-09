import {PriorityEnum} from "../Enums/PriorityEnum";
import {IsString, IsEnum, IsNumber, IsDefined, Max} from "class-validator";

interface Iitem {
    name: string,
    size: number,
    value: number,
    priority: PriorityEnum,
    dependencies: string[] | []
}

export class Item implements Iitem {
    @IsString()
    name: string

    @IsNumber()
    size: number

    @IsNumber()
    value: number

    @IsEnum(PriorityEnum)
    priority: PriorityEnum

    @IsDefined()
    dependencies: string[] | []

   constructor(input: Item) {
        this.name = input.name;
        this.size = input.size;
        this.value = input.value;
        this.priority = input.priority;
        this.dependencies = input.dependencies;
    }
}

