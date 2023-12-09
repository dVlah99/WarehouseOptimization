import {NextFunction, Request, Response} from "express";

export const errorHandle = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('ERROR HANDLER')
    res.status(400).send({message: error.message})
}


