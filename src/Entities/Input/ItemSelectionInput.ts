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

  constructor({ items, totalSpace }: ItemSelectionInput) {
    this.items = items.map((item) => new Item(item))
    this.totalSpace = totalSpace
  }
}
