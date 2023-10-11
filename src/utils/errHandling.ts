import { RequestHandler, ErrorRequestHandler, Request, Response, NextFunction } from "express";

export class ResponseError extends Error {
    constructor(public message: string, public statusCode?: number) {
        super(message)
    }
}

export const asyncHandler = (Api: Promise<RequestHandler>): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => (
        Api.catch((err) => {
            return next(err)
        })
    )
}

export const globalErrorHandler: ErrorRequestHandler  = (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    return res.status(err.statusCode || 500).json({error: err.message})
}
