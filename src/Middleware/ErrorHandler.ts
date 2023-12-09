import {NextFunction, Request, Response} from "express";
import {InputValidationError} from "../Entities/Errors/InputValidationError";

export function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
    if (error instanceof InputValidationError) {
        const { errors, isValid } = error.payload;
        res.status(400).send({ error: { message: error.message,payload: { errors, isValid } } });
    } else {
        res.status(500).send({ error: 'An unexpected error occurred.' });
    }
}


