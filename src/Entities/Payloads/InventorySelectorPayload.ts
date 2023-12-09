import {Item} from "../Types/Item";

export class InventorySelectorPayload {
    selectedItems: {
        totalSpace: number,
        amountOfSelectedItems: number
        totalWeight: number,
        items: Item[]
    }
    unselectedItems: {
        items: Item[]
    }
}