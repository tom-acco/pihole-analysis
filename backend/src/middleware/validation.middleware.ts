import type { Request, Response, NextFunction } from "express";

/**
 * Validates that a numeric ID exists in the request and is valid
 * @param source - Where to find the ID: "query", "params", or "body"
 */
export const validateId = (source: "query" | "params" | "body" = "query") => {
    return (req: Request, res: Response, next: NextFunction) => {
        let idValue: string | number | undefined;

        if (source === "query") {
            idValue = req.query.id as string;
        } else if (source === "params") {
            idValue = req.params.id as string;
        } else {
            idValue = req.body.id;
        }

        if (idValue === undefined || idValue === null || idValue === "") {
            return res.status(400).send("Missing id parameter");
        }

        const id = typeof idValue === "number" ? idValue : parseInt(idValue);

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

/**
 * Validates that an alias is provided in the request body
 */
export const validateAlias = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const alias = req.body.alias;

    if (alias === undefined || alias === null) {
        return res.status(400).send("Missing alias in request body");
    }

    if (typeof alias !== "string") {
        return res.status(400).send("Alias must be a string");
    }

    next();
};
