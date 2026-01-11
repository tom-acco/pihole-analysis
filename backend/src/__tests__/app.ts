import express from "express";
import type { Express } from "express";
import qs from "qs";

import { apiRouter } from "../routes/api.js";

export const createTestApp = (): Express => {
    const app: Express = express();

    // Middleware
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // Override query parser with qs
    app.set("query parser", (str: string) => qs.parse(str));

    // API routes
    app.use("/api", apiRouter());

    return app;
};
