import { Router } from "express";

import { DomainController } from "../controllers/domain.controller.js";

import { parsePagination } from "../utils/routes.js";
import { asyncHandler } from "../middleware/error-handler.middleware.js";
import {
    validateId,
    validateDomain,
    validateBulkDomainUpdate
} from "../middleware/validation.middleware.js";
import { validateDomainFormat } from "../middleware/domain-validator.middleware.js";

export const domainRouter = (): Router => {
    const router = Router();
    const domainController = new DomainController();

    router.get(
        "/domains",
        asyncHandler(async (req, res) => {
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
        }, "getting domains")
    );

    router.get(
        "/domain",
        validateId("query"),
        asyncHandler(async (req, res) => {
            const id = parseInt(req.query.id as string);
            const result = await domainController.getDomainClients(id);

            return res.status(200).json(result);
        }, "getting domain")
    );

    router.get(
        "/domains/new",
        asyncHandler(async (req, res) => {
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
        }, "getting new domains")
    );

    router.get(
        "/domains/flagged",
        asyncHandler(async (req, res) => {
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
        }, "getting flagged domains")
    );

    router.get(
        "/domains/ignored",
        asyncHandler(async (req, res) => {
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
        }, "getting ignored domains")
    );

    router.post(
        "/domain/interrogate",
        validateDomain,
        validateDomainFormat,
        asyncHandler(async (req, res) => {
            const result = await domainController.interrogate(req.body.domain);
            return res.status(200).send(result);
        }, "interrogating domain")
    );

    router.post(
        "/domain/acknowledge",
        validateBulkDomainUpdate,
        asyncHandler(async (req, res) => {
            const domains = Array.isArray(req.body.domains)
                ? req.body.domains
                : [req.body.domains];

            for (const domain of domains) {
                await domainController.setAcknowledge(domain, req.body.value);
            }

            return res.status(200).send();
        }, "acknowledging domains")
    );

    router.post(
        "/domain/flag",
        validateBulkDomainUpdate,
        asyncHandler(async (req, res) => {
            const domains = Array.isArray(req.body.domains)
                ? req.body.domains
                : [req.body.domains];

            for (const domain of domains) {
                await domainController.setFlag(domain, req.body.value);
            }

            return res.status(200).send();
        }, "flagging domains")
    );

    router.post(
        "/domain/ignore",
        validateBulkDomainUpdate,
        asyncHandler(async (req, res) => {
            const domains = Array.isArray(req.body.domains)
                ? req.body.domains
                : [req.body.domains];

            for (const domain of domains) {
                await domainController.setIgnore(domain, req.body.value);
            }

            return res.status(200).send();
        }, "ignoring domains")
    );

    return router;
};
