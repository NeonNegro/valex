import { NextFunction, Request, Response } from "express";

export function errorHandlerMiddleware(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
){
    console.log(error);

    if(error.type === 'conflict')
        return res.status(409).send(error.message);
    if(error.type === 'not_found')
        return res.status(404).send(error.message);
    if(error.type === 'unauthorized')
        return res.status(401).send(error.message);

    res.sendStatus(500);
}