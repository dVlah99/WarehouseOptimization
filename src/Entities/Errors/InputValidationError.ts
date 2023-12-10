import { ValidatorErrorPayload } from '../../Utils/Validators/ClassValidator'
//Custom error for input validation
export class InputValidationError extends Error {
  payload: ValidatorErrorPayload

  constructor(payload: ValidatorErrorPayload) {
    super('Input Validation Error')
    this.payload = payload
  }
}
