import type { RequestHandler } from "express";
import { Router } from "express";

import { clientRouter } from "./client.routes.js";
import { domainRouter } from "./domain.routes.js";
import { syncRouter } from "./sync.routes.js";

export const apiRouter = (): RequestHandler => {
    const router = Router();

    router.use(clientRouter());
    router.use(domainRouter());
    router.use(syncRouter());

    return router;
};
