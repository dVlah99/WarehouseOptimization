/* eslint-disable indent */
import { PriorityEnum } from '../Enums/PriorityEnum'
import { IsString, IsEnum, IsNumber, IsArray } from 'class-validator'

interface IItem {
  name: string
  size: number
  value: number
  priority: PriorityEnum
  dependencies: string[] | []
}

export class Item implements IItem {
  @IsString()
  name: string

  @IsNumber()
  size: number

  @IsNumber()
  value: number

  @IsEnum(PriorityEnum)
  priority: PriorityEnum

  @IsArray()
  @IsString({ each: true, always: undefined })
  dependencies: string[] = []

  constructor(input: Item) {
    this.name = input.name
    this.size = input.size
    this.value = input.value
    this.priority = input.priority
    this.dependencies = input.dependencies
  }
}
