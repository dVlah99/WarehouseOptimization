import 'reflect-metadata'
import {validate} from 'class-validator'
import {ItemSelectionInput} from '../Entities/Input/ItemSelectionInput'
import {Item} from "../Entities/Types/Item"
import {PriorityEnum} from "../Entities/Enums/PriorityEnum"

export type ValidatorErrorPayload = {
    errors: Record<string, string[]> | null,
    isValid: boolean
}

export class UserValidation {
    static async validateUserInput(userInput: ItemSelectionInput): Promise<ValidatorErrorPayload> {
        try {
            const errors: Record<string, string[]> = {}
            const itemSelectionInput = new ItemSelectionInput(userInput)

            const validationErrors = await validate(itemSelectionInput, {
                forbidUnknownValues: false
            })

            if (validationErrors.length > 0) {
                validationErrors.forEach((error) => {
                    const { property, constraints } = error
                    errors[property] = Object.values(constraints || {})
                })

                return { errors, isValid: false }
            }

            return { errors: null, isValid: true }
        } catch (error) {
            console.error('Validation error:', error)
            return { errors: { unexpected: ['An unexpected error occurred during validation'] }, isValid: false }
        }
    }
}
