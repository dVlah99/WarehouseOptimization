import { InventorySelectorPayload } from '../Entities/Payloads/InventorySelectorPayload'
import { ItemSelectionInput } from '../Entities/Input/ItemSelectionInput'
import { Item } from '../Entities/Types/Item'
import { ClassValidator } from '../Utils/Validators/ClassValidator'
import { PriorityEnum } from '../Entities/Enums/PriorityEnum'
import { InputValidationError } from '../Entities/Errors/InputValidationError'

abstract class IInventorySelectionController {
  static fillInventory(): Item[] | string {
    return 'Abstract class filler'
  }
}

export class InventorySelectionController implements IInventorySelectionController {
  public static async fillInventory(input: ItemSelectionInput): Promise<InventorySelectorPayload> {
    //Checks the input array for null or undefined values. Throws an error if it detects one!
    ClassValidator.arrayContainsNullOrUndefined(input.items)

    const itemSelectionInput = new ItemSelectionInput(input) //We must create an instance of an object to use class validator properly.

    //Validates items and totalSpace data from input. It will detect nulls, undefined and invalid data types.
    //An error is thrown if there is an error in the input.
    ClassValidator.validateInput(itemSelectionInput)

    try {
      //The main logic for selecting items
      return this.selectItems(input.items, input.totalSpace)
    } catch (error) {
      if (error instanceof InputValidationError) {
        throw error
      } else {
        throw new Error('An unexpected error occurred.')
      }
    }
  }

  private static async selectItems(items: Item[], totalSpace: number): Promise<InventorySelectorPayload> {
    //Firstly, I sort and group the items by priority
    const sortedItems = this.sortItems(items)
    //This array is used to save info about the selected items.
    const selectedItems: Item[] = []
    //Remaining available space in the warehouse.
    //Each time an item is added to selectedItems, this number decreases by item size.
    let remainingSpace = totalSpace
    //Total value of selected items.
    let totalValue = 0

    //The one thing I didn't understand correctly is the way I should consider dependencies
    //What I mean by that is that I
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
        itemTotalSpace: totalSpace - remainingSpace,
        totalValue: totalValue,
        amountOfSelectedItems: selectedItems.length,
        items: selectedItems,
      },
      notSelectedItems: {
        items: items.filter((item) => !selectedItems.includes(item)),
      },
    }
  }

  //Simpler sortItems that only sorts by priority
  /*    private static sortItems(items: Item[]): Item[] {
        return items.sort((a, b) => {
            if (a.priority !== b.priority) {
                return a.priority - b.priority
            } else {
                return b.value - a.value
            }
        })
    }*/

  //I'm going to assume that an item with priority 2 will be dependant only on items of same or higher priority
  //Because of that, my logic is to group items by priority, and them sort them in a priority group by the number of dependencies
  private static sortItems(items: Item[]): Item[] {
    //Using a map to sort items by priority
    //Each priority is defined as an array of Items
    const priorityMap = new Map<PriorityEnum, Item[]>()

    // Group items by priority. If a map for a priority value is not found, create it.
    items.forEach((item) => {
      const priority = item.priority
      if (!priorityMap.has(priority)) {
        priorityMap.set(priority, [])
      }
      //Retrieve value associated with a priority.
      //If the value is null or undefined it won't throw an error because of the ?
      //Take that value and push the new item to the end of that array
      priorityMap.get(priority)?.push(item)
    })

    const sortedItems: Item[] = []
    //Advanced sorting mechanism. Firstly we retrieve the keys and sort them,
    //then we fetch items for the current priority. Then I group items based on their dependencies.
    //Items with no dependencies have a higher priority. After them are items with dependencies of the same priority level.
    //My goal here is to have items with no dependencies and highest priority to be selected first and then
    //items with the same priority with dependencies
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
    //Takes a single dependency from an item and runs it against the names of already selected items.
    //If the dependency is not found as a name in one of the selected items, this function will return false
    //and the item will not be selected, meanwhile the function returns true if all the dependencies are found
    //as names in the list of selected items and the item will be selected.
    for (const dependency of item.dependencies) {
      if (!selectedItems.some((selected) => selected.name === dependency)) {
        return false
      }
    }
    return true
  }
}
