import { NextFunction, Request, Response } from 'express'

export function validateRequestBody(req: Request, res: Response, next: NextFunction) {
  const requestBody = req.body

  // Check if the request body is null or undefined
  if (requestBody === null || requestBody === undefined) {
    return res.status(400).json({ error: 'Request body cannot be null or undefined' })
  }

  // Check if the request body is an empty object
  if (Object.keys(requestBody).length === 0 && requestBody.constructor === Object) {
    return res.status(400).json({ error: 'Request body cannot be an empty object' })
  }

  next()
}
