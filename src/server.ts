import 'reflect-metadata'
import express, { NextFunction, Request, Response } from 'express'
import { InventorySelectionController } from './Controllers/InventorySelectionController'
import { ItemSelectionInput } from './Entities/Input/ItemSelectionInput'
import { errorHandler } from './Utils/Middleware/ErrorHandler'
import { validateRequestBody } from './Utils/Middleware/ValidateRequestBody'
import dotenv from 'dotenv'

const app = express()
app.use(express.json())
//Used for env variables
dotenv.config()

//POST route to receive warehouse data. I used post because there are no data changes, and we aren't
//retrieving any value. We only need info about the optimal way of filling an inventory.
//validateRequestBody middleware checks that the body from the request is not null, undefined or an empty object.
app.post('/fill-inventory', validateRequestBody, async (req: Request, res: Response, next: NextFunction) => {
  const input: ItemSelectionInput = req.body
  try {
    const itemsToBeStored = await InventorySelectionController.fillInventory(input)
    res.status(200).send({ selectedItems: itemsToBeStored })
  } catch (error) {
    next(error) // Pass error to the error-handling middleware
  }
})

//Error-handling middleware
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`Server running on port ${PORT}`)
})

export default app
