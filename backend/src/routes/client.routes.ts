import { Router } from "express";

import { ClientController } from "../controllers/client.controller.js";

import { parsePagination } from "../utils/routes.js";
import { asyncHandler } from "../middleware/error-handler.middleware.js";
import {
    validateId,
    validateAlias
} from "../middleware/validation.middleware.js";

export const clientRouter = (): Router => {
    const router = Router();
    const clientController = new ClientController();

    router.get(
        "/clients",
        asyncHandler(async (req, res) => {
            const { search, page, itemsPerPage, sortBy } = parsePagination(req);

            const result = await clientController.getAllPaginated(
                search,
                page,
                itemsPerPage,
                sortBy
            );

            return res.status(200).json(result);
        }, "getting clients")
    );

    router.get(
        "/client",
        validateId("query"),
        asyncHandler(async (req, res) => {
            const id = parseInt(req.query.id as string);
            const result = await clientController.getClientDomains(id);

            return res.status(200).json(result);
        }, "getting client")
    );

    router.post(
        "/client/alias",
        validateAlias,
        asyncHandler(async (req, res) => {
            const result = await clientController.setAlias(
                req.body.ipaddress,
                req.body.alias
            );

            return res.status(200).json(result);
        }, "setting client alias")
    );

    return router;
};
