import { Item } from '../../src/Entities/Types/Item'
import Chance from 'chance'
import { PriorityEnum } from '../../src/Entities/Enums/PriorityEnum'

export class ItemFactory {
  private readonly chance = new Chance()
  public create(versionOverride?: Partial<Item>): Item {
    return new Item({
      name: versionOverride?.name ?? this.chance.name(),
      value: versionOverride?.value ?? this.chance.integer({ min: 20, max: 5000 }),
      size: versionOverride?.size ?? this.chance.integer({ min: 20, max: 5000 }),
      priority: versionOverride?.priority ?? PriorityEnum.HIGHEST,
      dependencies: versionOverride?.dependencies ?? [],
    })
  }
}
