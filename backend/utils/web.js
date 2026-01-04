const qs = require("qs");
const express = require("express");
const session = require("express-session");

const startWeb = async (database) => {
    const app = express();

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // Override query parser
    app.set("query parser", (str) => qs.parse(str));

    app.use(
        session({
            resave: true,
            saveUninitialized: false,
            secret: process.env.WEB_SECRET ?? "PASSWORD"
        })
    );

    app.set("trust proxy", true);

    app.use("/api", require("../routes/api")(database));

    app.use("/", express.static(`${process.env.INTERNAL_ROOT}/www`));
    app.use("/*splat", express.static(`${process.env.INTERNAL_ROOT}/www`));

    const server = app.listen(
        process.env.WEB_PORT ?? 8000,
        process.env.WEB_ADDR ?? "127.0.0.1",
        (err) => {
            if (err) {
                throw err;
            }

            console.info(
                `Web application running on http://${server.address().address}:${server.address().port}`
            );
        }
    );

    return server;
};

module.exports = startWeb;
