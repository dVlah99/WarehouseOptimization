import {ValidatorErrorPayload} from "../../Validators/ItemSelectionInputValidator";

export class InputValidationError extends Error {
    payload: ValidatorErrorPayload;

    constructor(payload: ValidatorErrorPayload) {
        super('Input Validation Error');
        this.payload = payload;
    }
}