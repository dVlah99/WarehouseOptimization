import { InventorySelectorPayload } from '../Entities/Payloads/InventorySelectorPayload'
import { ItemSelectionInput } from '../Entities/Input/ItemSelectionInput'
import { Item } from '../Entities/Types/Item'
import { InputValidation, ValidatorErrorPayload } from '../Utils/Validators/ItemSelectionInputValidator'
import { PriorityEnum } from '../Entities/Enums/PriorityEnum'
import { InputValidationError } from '../Entities/Errors/InputValidationError'

abstract class IInventorySelectionController {
  static fillInventory(): Item[] | string {
    return 'Abstract class filler'
  }
}

export class InventorySelectionController implements IInventorySelectionController {
  public static async fillInventory(input: ItemSelectionInput): Promise<InventorySelectorPayload> {
    const userInputValidation = await InputValidation.validateUserInput(input)

    try {
      this.isInputValid(userInputValidation)
      return this.selectItems(input.items, input.totalSpace)
    } catch (error) {
      if (error instanceof InputValidationError) {
        throw error // Propagate InputValidationError
      } else {
        throw new Error('An unexpected error occurred.')
      }
    }
  }

  private static selectItems(items: Item[], totalSpace: number): InventorySelectorPayload {
    const sortedItems = this.sortItems(items)
    const selectedItems: Item[] = []
    let remainingSpace = totalSpace
    let totalValue = 0

    for (const item of sortedItems) {
      if (item.size <= remainingSpace) {
        const dependenciesMet = this.checkDependencies(selectedItems, item)
        if (dependenciesMet) {
          selectedItems.push(item)
          remainingSpace -= item.size
          totalValue += item.value
        }
      }
    }

    return {
      selectedItems: {
        totalSpace,
        totalValue: totalValue,
        amountOfSelectedItems: selectedItems.length,
        totalWeight: totalSpace - remainingSpace,
        items: selectedItems,
      },
      unselectedItems: {
        items: items.filter((item) => !selectedItems.includes(item)),
      },
    }
  }

  //Simpler sortItems that will leave items with dependencies
  /*    private static sortItems(items: Item[]): Item[] {
        return items.sort((a, b) => {
            if (a.priority !== b.priority) {
                return a.priority - b.priority
            } else {
                return b.value - a.value
            }
        })
    }*/

  private static sortItems(items: Item[]): Item[] {
    //Using
    const priorityMap = new Map<PriorityEnum, Item[]>()

    // Group items by priority
    items.forEach((item) => {
      const priority = item.priority
      if (!priorityMap.has(priority)) {
        priorityMap.set(priority, [])
      }
      priorityMap.get(priority)?.push(item)
    })

    const sortedItems: Item[] = []
    for (const priority of Array.from(priorityMap.keys()).sort()) {
      const priorityItems = priorityMap.get(priority) || []
      const itemsWithDependencies = priorityItems.filter((item) => item.dependencies.length > 0)
      const itemsWithoutDependencies = priorityItems.filter((item) => item.dependencies.length === 0)

      sortedItems.push(...itemsWithoutDependencies)
      sortedItems.push(...itemsWithDependencies)
    }

    return sortedItems
  }

  private static checkDependencies(selectedItems: Item[], item: Item): boolean {
    for (const dependency of item.dependencies) {
      if (!selectedItems.some((selected) => selected.name === dependency)) {
        return false
      }
    }
    return true
  }

  private static isInputValid(value: ValidatorErrorPayload) {
    if (!value.isValid) {
      throw new InputValidationError(value)
    }
  }
}
