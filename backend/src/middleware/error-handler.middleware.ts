import type { Request, Response, NextFunction } from "express";

import {
    ClientControllerException,
    DomainControllerException,
    SyncControllerException
} from "../utils/exceptions.js";

type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

/**
 * Wraps async route handlers to automatically catch errors
 * and handle controller exceptions with proper status codes
 */
export const asyncHandler = (
    fn: AsyncRequestHandler,
    errorContext?: string
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (err) {
            if (
                err instanceof ClientControllerException ||
                err instanceof DomainControllerException ||
                err instanceof SyncControllerException
            ) {
                return res.status(err.status).send(err.message);
            } else {
                const context = errorContext || "processing request";
                console.error(`Error ${context}:`, err);
                return res.status(500).send();
            }
        }
    };
};
