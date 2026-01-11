import type { Request, Response, NextFunction } from "express";

/**
 * Basic domain name validation regex
 * Matches:
 * - Standard domains: example.com, sub.example.com
 * - Localhost
 * - IP addresses
 * - Ports: example.com:8080
 */
const DOMAIN_REGEX =
    /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(:[0-9]{1,5})?$|^localhost(:[0-9]{1,5})?$|^(\d{1,3}\.){3}\d{1,3}(:[0-9]{1,5})?$/;

/**
 * Validates domain name format
 * Should be used after validateDomain middleware
 */
export const validateDomainFormat = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const domain = req.body.domain;

    if (!domain) {
        return res.status(400).send("No domain provided for validation");
    }

    if (!DOMAIN_REGEX.test(domain)) {
        return res.status(400).send(`Invalid domain format: ${domain}`);
    }

    next();
};

/**
 * Validates that all domains in a bulk update have valid format
 * Should be used after validateBulkDomainUpdate middleware
 */
export const validateBulkDomainsFormat = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.body.domains) {
        return res.status(400).send("No domains provided for validation");
    }

    const domains = Array.isArray(req.body.domains)
        ? req.body.domains
        : [req.body.domains];

    if (domains.length === 0) {
        return res.status(400).send("No domains provided for validation");
    }

    const invalidDomains = domains.filter((d: string) => !DOMAIN_REGEX.test(d));

    if (invalidDomains.length > 0) {
        return res
            .status(400)
            .send(`Invalid domain format: ${invalidDomains.join(", ")}`);
    }

    next();
};
