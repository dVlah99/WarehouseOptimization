import { NextFunction, Request, Response } from 'express'
import { InputValidationError } from '../../Entities/Errors/InputValidationError'

type CustomError = InputValidationError | Error
//Error handling middleware used for dynamically formatting appropriate errors
//and sending it back to the user
export function errorHandler(error: CustomError, req: Request, res: Response, next: NextFunction) {
  if (error instanceof InputValidationError) {
    const { errors, isValid } = error.payload
    res.status(400).send({ error: { message: error.message, payload: { errors, isValid } } })
  } else {
    res.status(500).send({ error: 'An unexpected error occurred.', message: error.message })
  }
  next()
}
