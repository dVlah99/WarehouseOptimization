import { validateSync, ValidationError } from 'class-validator'
import { InputValidationError } from '../../Entities/Errors/InputValidationError'

export type ValidatorErrorPayload = {
  errors: Record<string, string[]> | null
  isValid: boolean
}

//The job of this file is to validate data of a class. Check the Item class in the Item.ts file to see the constraints
//It should do it dynamically for all types of classes so that's why I use any as an argument type.

export class ClassValidator {
  //We take the input and run it against certain validation rules. It collects all the errors
  //and returns them as the ValidatorErrorPayload. If there are no errors isValid will be true.
  static validateInput(input: any) {
    //An object to hold potential validation errors.
    const errors: Record<string, string[]> = {}

    //Runs the validation process against the provided input
    const validationErrors = validateSync(input)

    //For each error, it extracts the property causing the error and the specific validator constraints.
    //It also stores the constraints as error messages.
    //If there are no validation errors, the code returns true.
    //Even though it's synchronous, unexpected issues like code errors or unhandled exceptions can still occur.
    //So adding a try catch block will add an extra layer of safety
    if (validationErrors.length > 0) {
      validationErrors.forEach((error: ValidationError) => {
        const { property, constraints } = error
        if (constraints) {
          errors[property] = Object.values(constraints)
        }
      })

      throw new InputValidationError({
        isValid: false,
        errors,
      })
    }
  }

  static arrayContainsNullOrUndefined(array: any[]) {
    for (const item of array) {
      if (item === null || item === undefined) {
        throw new Error('Array cannot contain null or undefined values')
      }
    }
  }
}
