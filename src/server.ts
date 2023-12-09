import 'reflect-metadata'
import express, {NextFunction, Request, Response} from 'express';
import {InventorySelectorPayload} from "./Entities/Payloads/InventorySelectorPayload";
import {InventorySelectionController} from "./Controllers/InventorySelectionController";
import {ItemSelectionInput} from "./Entities/Input/ItemSelectionInput";
import {Item} from "./Entities/Types/Item";
import {errorHandle} from './Middleware/ErrorHandle'

const app = express();
app.use(express.json());

// POST route to receive warehouse data
app.post('/fill-inventory', async (req: Request, res: Response, next: NextFunction) => {
    const input: ItemSelectionInput = req.body;
    try {
        const test = await InventorySelectionController.fillInventory(input, res)
        console.log('WHY U HERE?')
        res.status(200).send({selectedItems: test})
    } catch (error) {
        console.log('ERROR IN SERVER: ', error)
        if(error instanceof Error) {
            console.log('PICKA')
            next(error)
        }
    }
});

app.use(errorHandle)

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
