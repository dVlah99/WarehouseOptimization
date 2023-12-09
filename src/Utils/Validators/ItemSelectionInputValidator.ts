import 'reflect-metadata'
import { validate, ValidationError } from 'class-validator'
import { ItemSelectionInput } from '../../Entities/Input/ItemSelectionInput'

export type ValidatorErrorPayload = {
  errors: Record<string, string[]> | null
  isValid: boolean
}

export class InputValidation {
  static async validateUserInput(userInput: ItemSelectionInput): Promise<ValidatorErrorPayload> {
    try {
      const errors: Record<string, string[]> = {}
      const itemSelectionInput = new ItemSelectionInput(userInput)

      const validationErrors = await validate(itemSelectionInput, {
        forbidUnknownValues: false,
      })

      if (validationErrors.length > 0) {
        validationErrors.forEach((error: ValidationError) => {
          const { property, constraints } = error
          if (constraints) {
            errors[property] = Object.values(constraints)
          }
        })
        console.log(JSON.stringify(validationErrors, null, 2))
        return {
          errors,
          isValid: false,
        }
      }

      return {
        errors: null,
        isValid: true,
      }
    } catch (error) {
      return {
        errors: { message: ['An unexpected error occurred during validation'] },
        isValid: false,
      }
    }
  }
}
