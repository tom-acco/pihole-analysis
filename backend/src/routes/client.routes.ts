import { Router, type Request, type Response } from "express";

import { ClientController } from "../controllers/client.controller.js";
import { ClientControllerException } from "../utils/exceptions.js";

import { parsePagination } from "../utils/routes.js";

export const clientRouter = (): Router => {
    const router = Router();
    const clientController = new ClientController();

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

    return router;
};
