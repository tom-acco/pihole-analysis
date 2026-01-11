import path from "path";
import qs from "qs";
import express from "express";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import type { Server } from "http";

import { apiRouter } from "./routes/api.js";

export const startWeb = async (): Promise<Server> => {
    const app: Express = express();

    // Middleware
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // Override query parser with qs
    app.set("query parser", (str: string) => qs.parse(str));

    app.use(
        session({
            resave: true,
            saveUninitialized: false,
            secret: process.env.WEB_SECRET ?? "PASSWORD"
        })
    );

    // Trust proxy headers
    app.set("trust proxy", true);

    // API routes
    app.use("/api", apiRouter() as RequestHandler);

    // Serve static files
    app.use(
        "/",
        express.static(`${path.join(process.env.INIT_CWD ?? "./", "www")}`)
    );
    app.use(
        "/*splat",
        express.static(`${path.join(process.env.INIT_CWD ?? "./", "www")}`)
    );

    // Start server
    const port = Number(process.env.WEB_PORT ?? 8000);
    const host = process.env.WEB_ADDR ?? "127.0.0.1";

    const server = app.listen(port, host, (err?: any) => {
        if (err) throw err;

        const address = server.address();
        const addr =
            typeof address === "string"
                ? address
                : `${address?.address}:${address?.port}`;

        console.info(`Web application running on http://${addr}`);
    });

    return server;
};
