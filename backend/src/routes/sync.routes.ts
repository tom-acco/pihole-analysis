import { Router } from "express";

import { SyncController } from "../controllers/sync.controller.js";

import { asyncHandler } from "../middleware/error-handler.middleware.js";

export const syncRouter = (): Router => {
    const router = Router();
    const syncController = new SyncController();

    router.get(
        "/sync",
        asyncHandler(async (req, res) => {
            const result = await syncController.getLast100();
            return res.status(200).json(result);
        }, "getting sync logs")
    );

    router.post(
        "/sync",
        asyncHandler(async (req, res) => {
            syncController.syncNow();

            setTimeout(() => {
                return res.status(200).send();
            }, 500);
        }, "running sync")
    );

    return router;
};
