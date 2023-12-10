/* eslint-disable indent */
import { Item } from '../Types/Item'
import { IsDefined, Min, Max, ValidateNested } from 'class-validator'
import { IsNotEmptyArray } from '../../Utils/Decorators/isNotEmptyArray'

export class ItemSelectionInput {
  @IsDefined({ each: true })
  @ValidateNested({ each: true })
  @IsNotEmptyArray()
  items: Item[]

  @Min(50)
  @Max(400)
  @IsDefined()
  totalSpace: number

  constructor(input: ItemSelectionInput) {
    // Check for null or undefined values in the input array
    if (input.items.some((item) => item === null || item === undefined)) {
      throw new Error('Items array cannot contain null or undefined values')
    }

    this.items = input.items.map((item) => new Item(item))
    this.totalSpace = input.totalSpace
  }
}
