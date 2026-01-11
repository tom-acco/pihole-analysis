import { Router, type Request, type Response } from "express";

import { SyncController } from "../controllers/sync.controller.js";
import { SyncControllerException } from "../classes/Exceptions.js";

export const syncRouter = (): Router => {
    const router = Router();
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

    return router;
};
