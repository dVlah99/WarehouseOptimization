import {Item} from "../Types/Item";

export type InventorySelectorPayload = {
    selectedItems: {
        totalSpace: number;
        amountOfSelectedItems: number;
        totalWeight: number;
        items: Item[];
    };
    unselectedItems: {
        items: Item[];
    };
};