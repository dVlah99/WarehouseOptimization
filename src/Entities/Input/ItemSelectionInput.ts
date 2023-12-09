/* eslint-disable indent */
import { Item } from '../Types/Item'
import { IsDefined, Min, Max, IsNotEmpty, ValidateNested } from 'class-validator'
import { IsNotEmptyArray } from '../../Utils/Decorators/isNotEmptyArray'

/*class Mega {
  input: ItemSelectionInput

  public static fromMega(input: ItemSelectionInput):
}*/

export class ItemSelectionInput {
  @IsDefined()
  @IsNotEmpty({ each: true })
  @ValidateNested()
  @IsNotEmptyArray({ message: 'Input array must not be empty!' })
  items: Item[]

  @Min(50)
  @Max(400)
  @IsDefined()
  totalSpace: number

  constructor(input: ItemSelectionInput) {
    this.items = input.items.map((item) => new Item(item))
    this.totalSpace = input.totalSpace
  }
}
/*
public static fromSoftwareUpdate(softwareUpdate: SoftwareUpdate): SoftwareUpdateType {
  return new SoftwareUpdateType({
    createdAt: softwareUpdate.createdAt,
    databaseId: softwareUpdate.id,
    deployedAt: softwareUpdate.deployedAt,
    deployedHardwareComponentMappings: softwareUpdate.deployedHardwareComponentMappings,
    id: softwareUpdate.id,
    isForced: softwareUpdate.isForced === UpdateCategory.FORCED,
    isOtaCompatible: softwareUpdate.isOtaCompatible,
    networks: softwareUpdate.networks,
    releaseNotes: softwareUpdate.releaseNotes,
    status: softwareUpdate.status,
    updateId: softwareUpdate.updateId,
    updatedAt: softwareUpdate.updatedAt,
    version: softwareUpdate.version,
  })
}*/
