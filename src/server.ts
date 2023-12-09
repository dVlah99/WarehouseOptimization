import 'reflect-metadata'
import express, { NextFunction, Request, Response } from 'express'
import { InventorySelectionController } from './Controllers/InventorySelectionController'
import { ItemSelectionInput } from './Entities/Input/ItemSelectionInput'
import { errorHandler } from './Middleware/ErrorHandler'

const app = express()
app.use(express.json())

// POST route to receive warehouse data
app.post('/fill-inventory', async (req: Request, res: Response, next: NextFunction) => {
  const input: ItemSelectionInput = req.body
  try {
    const itemsToBeStored = await InventorySelectionController.fillInventory(input)
    res.status(200).send({ selectedItems: itemsToBeStored })
  } catch (error) {
    next(error) // Pass error to the error-handling middleware
  }
})

app.use(errorHandler)

const PORT = 4000
app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`Server running on port ${PORT}`)
})
