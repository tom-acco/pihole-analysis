const ClientController = require(`../controllers/client.controller`);
const DomainController = require(`../controllers/domain.controller`);

const { ClientControllerException } = require("../classes/Errors");
const { DomainControllerException } = require("../classes/Errors");

const api = (database) => {
    //Create the router
    const router = require("express").Router();

    const clientController = new ClientController(database);
    const domainController = new DomainController(database);

    router.get("/clients", async (req, res) => {
        try {
            if (!req.query.search) {
                req.query.search = null;
            }

            if (req.query.page) {
                req.query.page = parseInt(req.query.page);
            }

            if (req.query.itemsPerPage) {
                req.query.itemsPerPage = parseInt(req.query.itemsPerPage);
            }

            const result = await clientController.getAllPaginated(
                req.query.search,
                req.query.page,
                req.query.itemsPerPage,
                req.query.sortBy
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

    router.get("/client", async (req, res) => {
        try {
            const result = await clientController.getClientDomains(
                req.query.id
            );
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

    router.get("/domains", async (req, res) => {
        try {
            if (!req.query.search) {
                req.query.search = null;
            }

            if (req.query.page) {
                req.query.page = parseInt(req.query.page);
            }

            if (req.query.itemsPerPage) {
                req.query.itemsPerPage = parseInt(req.query.itemsPerPage);
            }

            const result = await domainController.getAllPaginated(
                req.query.search,
                req.query.page,
                req.query.itemsPerPage,
                req.query.sortBy,
                { hidden: false }
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

    router.get("/domains/new", async (req, res) => {
        try {
            if (!req.query.search) {
                req.query.search = null;
            }

            if (req.query.page) {
                req.query.page = parseInt(req.query.page);
            }

            if (req.query.itemsPerPage) {
                req.query.itemsPerPage = parseInt(req.query.itemsPerPage);
            }

            const result = await domainController.getAllPaginated(
                req.query.search,
                req.query.page,
                req.query.itemsPerPage,
                req.query.sortBy,
                { hidden: false, acknowledged: false, flagged: false }
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

    router.get("/domains/flagged", async (req, res) => {
        try {
            if (!req.query.search) {
                req.query.search = null;
            }

            if (req.query.page) {
                req.query.page = parseInt(req.query.page);
            }

            if (req.query.itemsPerPage) {
                req.query.itemsPerPage = parseInt(req.query.itemsPerPage);
            }

            const result = await domainController.getAllPaginated(
                req.query.search,
                req.query.page,
                req.query.itemsPerPage,
                req.query.sortBy,
                { hidden: false, flagged: true }
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

    router.get("/domains/hidden", async (req, res) => {
        try {
            if (!req.query.search) {
                req.query.search = null;
            }

            if (req.query.page) {
                req.query.page = parseInt(req.query.page);
            }

            if (req.query.itemsPerPage) {
                req.query.itemsPerPage = parseInt(req.query.itemsPerPage);
            }

            const result = await domainController.getAllPaginated(
                req.query.search,
                req.query.page,
                req.query.itemsPerPage,
                req.query.sortBy,
                { hidden: true }
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

    router.get("/domain", async (req, res) => {
        try {
            const result = await domainController.getDomainClients(
                req.query.id
            );
            return res.status(200).json(result);
        } catch (err) {
            if (err instanceof ClientControllerException) {
                return res.status(err.status).send(err.message);
            } else {
                console.error("Error getting domain", err);
                return res.status(500).send();
            }
        }
    });

    router.post("/domain/interrogate", async (req, res) => {
        try {
            const result = await domainController.interrogate(req.body.domain);
            return res.status(200).send(result);
        } catch (err) {
            if (err instanceof ClientControllerException) {
                return res.status(err.status).send(err.message);
            } else {
                console.error("Error interrogating domain", err);
                return res.status(500).send();
            }
        }
    });

    router.post("/domain/acknowledge", async (req, res) => {
        try {
            const result = await domainController.toggleAcknowledge(
                req.body.domain
            );
            return res.status(200).send(result);
        } catch (err) {
            if (err instanceof ClientControllerException) {
                return res.status(err.status).send(err.message);
            } else {
                console.error("Error acknowledging domain", err);
                return res.status(500).send();
            }
        }
    });

    router.post("/domain/flag", async (req, res) => {
        try {
            const result = await domainController.toggleFlag(req.body.domain);
            return res.status(200).send(result);
        } catch (err) {
            if (err instanceof ClientControllerException) {
                return res.status(err.status).send(err.message);
            } else {
                console.error("Error flagging domain", err);
                return res.status(500).send();
            }
        }
    });

    router.post("/domain/hide", async (req, res) => {
        try {
            const result = await domainController.toggleHide(req.body.domain);
            return res.status(200).send(result);
        } catch (err) {
            if (err instanceof ClientControllerException) {
                return res.status(err.status).send(err.message);
            } else {
                console.error("Error hiding domain", err);
                return res.status(500).send();
            }
        }
    });

    return router;
};

module.exports = api;
