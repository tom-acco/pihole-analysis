import { Router, type Request, type Response } from "express";

import type { SortItem } from "../interfaces/common.js";

import { ClientController } from "../controllers/client.controller.js";
import { DomainController } from "../controllers/domain.controller.js";
import { SyncController } from "../controllers/sync.controller.js";

import {
    ClientControllerException,
    DomainControllerException,
    SyncControllerException
} from "../classes/Exceptions.js";

const parsePagination = (req: Request) => {
    const search: string | undefined =
        typeof req.query.search === "string" ? req.query.search : undefined;
    const page = req.query.page
        ? parseInt(req.query.page as string)
        : undefined;
    const itemsPerPage = req.query.itemsPerPage
        ? parseInt(req.query.itemsPerPage as string)
        : undefined;
    let sortBy: SortItem[] | undefined = undefined;

    if (typeof req.query.sortBy === "string") {
        try {
            const parsed = JSON.parse(req.query.sortBy);
            if (Array.isArray(parsed)) {
                sortBy = parsed.filter(
                    (item) =>
                        item.key &&
                        (item.order === "asc" || item.order === "desc")
                );
            }
        } catch (err) {
            console.warn("Invalid sortBy query:", req.query.sortBy);
        }
    }

    return { search, page, itemsPerPage, sortBy };
};

export const apiRouter = (): Router => {
    const router = Router();

    const clientController = new ClientController();
    const domainController = new DomainController();
    const syncController = new SyncController();

    router.get("/sync", async (req: Request, res: Response) => {
        try {
            const result = await syncController.getLast100();
            return res.status(200).json(result);
        } catch (err) {
            if (err instanceof SyncControllerException) {
                return res.status(err.status).send(err.message);
            } else {
                console.error("Error getting sync logs", err);
                return res.status(500).send();
            }
        }
    });

    router.post("/sync", async (req: Request, res: Response) => {
        try {
            syncController.syncNow();

            setTimeout(() => {
                return res.status(200).send();
            }, 500);
        } catch (err) {
            if (err instanceof SyncControllerException) {
                return res.status(err.status).send(err.message);
            } else {
                console.error("Error running sync", err);
                return res.status(500).send();
            }
        }
    });

    router.get("/clients", async (req: Request, res: Response) => {
        try {
            const { search, page, itemsPerPage, sortBy } = parsePagination(req);

            const result = await clientController.getAllPaginated(
                search,
                page,
                itemsPerPage,
                sortBy
            );

            return res.status(200).json(result);
        } catch (err) {
            if (err instanceof ClientControllerException) {
                return res.status(err.status).send(err.message);
            } else {
                console.error("Error getting clients", err);
                return res.status(500).send();
            }
        }
    });

    router.get("/client", async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.query.id as string);

            if (isNaN(id)) {
                return res.status(400).send("Invalid id");
            }
            const result = await clientController.getClientDomains(id);

            return res.status(200).json(result);
        } catch (err) {
            if (err instanceof ClientControllerException) {
                return res.status(err.status).send(err.message);
            } else {
                console.error("Error getting client", err);
                return res.status(500).send();
            }
        }
    });

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
