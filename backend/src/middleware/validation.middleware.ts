import type { Request, Response, NextFunction } from "express";

/**
 * Validates that a numeric ID exists in the request and is valid
 * @param source - Where to find the ID: "query" or "params"
 */
export const validateId = (source: "query" | "params" = "query") => {
    return (req: Request, res: Response, next: NextFunction) => {
        const idStr =
            source === "query"
                ? (req.query.id as string)
                : (req.params.id as string);

        if (!idStr) {
            return res.status(400).send("Missing id parameter");
        }

        const id = parseInt(idStr);

        if (isNaN(id) || id <= 0) {
            return res
                .status(400)
                .send("Invalid id: must be a positive number");
        }

        next();
    };
};

/**
 * Validates that a domain name is provided in the request body
 */
export const validateDomain = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const domain = req.body.domain;

    if (!domain || typeof domain !== "string") {
        return res
            .status(400)
            .send("Missing or invalid domain in request body");
    }

    if (domain.trim().length === 0) {
        return res.status(400).send("Domain cannot be empty");
    }

    next();
};

/**
 * Validates bulk domain update request body
 * Expects: { domains: string | string[], value: boolean }
 */
export const validateBulkDomainUpdate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { domains, value } = req.body;

    if (!domains) {
        return res.status(400).send("Missing domains in request body");
    }

    if (typeof value !== "boolean") {
        return res
            .status(400)
            .send("Missing or invalid value: must be boolean");
    }

    const domainArray = Array.isArray(domains) ? domains : [domains];

    if (domainArray.length === 0) {
        return res.status(400).send("Domains array cannot be empty");
    }

    if (
        !domainArray.every((d) => typeof d === "string" && d.trim().length > 0)
    ) {
        return res.status(400).send("All domains must be non-empty strings");
    }

    next();
};
