import { Router, type Request, type Response } from "express";

import { DomainController } from "../controllers/domain.controller.js";
import { DomainControllerException } from "../utils/exceptions.js";

import { parsePagination } from "../utils/routes.js";

const handleBulkDomainUpdate = async <T>(
    req: Request,
    res: Response,
    fn: (domain: string, value: any) => Promise<T>
) => {
    try {
        const domains = Array.isArray(req.body.domains)
            ? req.body.domains
            : [req.body.domains];

        for (const domain of domains) {
            await fn(domain, req.body.value);
        }

        return res.status(200).send();
    } catch (err) {
        if (err instanceof DomainControllerException) {
            return res.status(err.status).send(err.message);
        } else {
            console.error("Error updating domain", err);
            return res.status(500).send();
        }
    }
};

export const domainRouter = (): Router => {
    const router = Router();
    const domainController = new DomainController();

    router.get("/domains", async (req: Request, res: Response) => {
        try {
            const { search, page, itemsPerPage, sortBy } = parsePagination(req);
            const result = await domainController.getAllPaginated(
                search,
                page,
                itemsPerPage,
                sortBy,
                {
                    ignored: false
                }
            );
            return res.status(200).json(result);
        } catch (err) {
            if (err instanceof DomainControllerException) {
                return res.status(err.status).send(err.message);
            } else {
                console.error("Error getting domains", err);
                return res.status(500).send();
            }
        }
    });

    router.get("/domains/new", async (req: Request, res: Response) => {
        try {
            const { search, page, itemsPerPage, sortBy } = parsePagination(req);
            const result = await domainController.getAllPaginated(
                search,
                page,
                itemsPerPage,
                sortBy,
                {
                    ignored: false,
                    acknowledged: false,
                    flagged: false
                }
            );
            return res.status(200).json(result);
        } catch (err) {
            if (err instanceof DomainControllerException) {
                return res.status(err.status).send(err.message);
            } else {
                console.error("Error getting domains", err);
                return res.status(500).send();
            }
        }
    });

    router.get("/domains/flagged", async (req: Request, res: Response) => {
        try {
            const { search, page, itemsPerPage, sortBy } = parsePagination(req);
            const result = await domainController.getAllPaginated(
                search,
                page,
                itemsPerPage,
                sortBy,
                {
                    ignored: false,
                    flagged: true
                }
            );
            return res.status(200).json(result);
        } catch (err) {
            if (err instanceof DomainControllerException) {
                return res.status(err.status).send(err.message);
            } else {
                console.error("Error getting domains", err);
                return res.status(500).send();
            }
        }
    });

    router.get("/domains/ignored", async (req: Request, res: Response) => {
        try {
            const { search, page, itemsPerPage, sortBy } = parsePagination(req);
            const result = await domainController.getAllPaginated(
                search,
                page,
                itemsPerPage,
                sortBy,
                {
                    ignored: true
                }
            );
            return res.status(200).json(result);
        } catch (err) {
            if (err instanceof DomainControllerException) {
                return res.status(err.status).send(err.message);
            } else {
                console.error("Error getting domains", err);
                return res.status(500).send();
            }
        }
    });

    router.get("/domain", async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.query.id as string);

            if (isNaN(id)) {
                return res.status(400).send("Invalid id");
            }
            const result = await domainController.getDomainClients(id);

            return res.status(200).json(result);
        } catch (err) {
            if (err instanceof DomainControllerException) {
                return res.status(err.status).send(err.message);
            } else {
                console.error("Error getting domain", err);
                return res.status(500).send();
            }
        }
    });

    router.post("/domain/interrogate", async (req: Request, res: Response) => {
        try {
            const result = await domainController.interrogate(req.body.domain);
            return res.status(200).send(result);
        } catch (err) {
            if (err instanceof DomainControllerException) {
                return res.status(err.status).send(err.message);
            } else {
                console.error("Error interrogating domain", err);
                return res.status(500).send();
            }
        }
    });

    router.post("/domain/acknowledge", (req, res) =>
        handleBulkDomainUpdate(
            req,
            res,
            domainController.setAcknowledge.bind(domainController)
        )
    );

    router.post("/domain/flag", (req, res) =>
        handleBulkDomainUpdate(
            req,
            res,
            domainController.setFlag.bind(domainController)
        )
    );

    router.post("/domain/ignore", (req, res) =>
        handleBulkDomainUpdate(
            req,
            res,
            domainController.setIgnore.bind(domainController)
        )
    );

    return router;
};
