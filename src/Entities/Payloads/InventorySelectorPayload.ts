import { Item } from '../Types/Item'

//Return the data about the selection process
//It gives info on all the items that were selected, their total weight,
//total space from input, total space items take, amount of items selected
//and the list of items that did not make it into the selection process
export type InventorySelectorPayload = {
  selectedItems: {
    totalSpace: number
    itemTotalSpace: number
    totalValue: number
    amountOfSelectedItems: number
    items: Item[]
  }
  notSelectedItems: {
    items: Item[]
  }
}
