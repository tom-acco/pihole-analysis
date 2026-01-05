const ClientController = require(`../controllers/client.controller`);
const DomainController = require(`../controllers/domain.controller`);
const SyncController = require(`../controllers/sync.controller`);

const { ClientControllerException } = require("../classes/Errors");
const { DomainControllerException } = require("../classes/Errors");
const { SyncControllerException } = require("../classes/Errors");

const api = (database) => {
    //Create the router
    const router = require("express").Router();

    const clientController = new ClientController(database);
    const domainController = new DomainController(database);
    const syncController = new SyncController(database);

    router.get("/sync", async (req, res) => {
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

    router.post("/sync", async (req, res) => {
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
                { ignored: false }
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
                { ignored: false, acknowledged: false, flagged: false }
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
                { ignored: false, flagged: true }
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

    router.get("/domains/ignored", async (req, res) => {
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
                { ignored: true }
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
            if (err instanceof DomainControllerException) {
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
            if (err instanceof DomainControllerException) {
                return res.status(err.status).send(err.message);
            } else {
                console.error("Error interrogating domain", err);
                return res.status(500).send();
            }
        }
    });

    router.post("/domain/acknowledge", async (req, res) => {
        try {
            if (req.body.domains instanceof Array) {
                for (const domain of req.body.domains) {
                    await domainController.setAcknowledge(
                        domain,
                        req.body.value
                    );
                }
            } else {
                await domainController.setAcknowledge(
                    req.body.domains,
                    req.body.value
                );
            }

            return res.status(200).send();
        } catch (err) {
            if (err instanceof DomainControllerException) {
                return res.status(err.status).send(err.message);
            } else {
                console.error("Error acknowledging domain", err);
                return res.status(500).send();
            }
        }
    });

    router.post("/domain/flag", async (req, res) => {
        try {
            if (req.body.domains instanceof Array) {
                for (const domain of req.body.domains) {
                    await domainController.setFlag(domain, req.body.value);
                }
            } else {
                await domainController.setFlag(
                    req.body.domains,
                    req.body.value
                );
            }

            return res.status(200).send();
        } catch (err) {
            if (err instanceof DomainControllerException) {
                return res.status(err.status).send(err.message);
            } else {
                console.error("Error flagging domain", err);
                return res.status(500).send();
            }
        }
    });

    router.post("/domain/ignore", async (req, res) => {
        try {
            if (req.body.domains instanceof Array) {
                for (const domain of req.body.domains) {
                    await domainController.setIgnore(domain, req.body.value);
                }
            } else {
                await domainController.setIgnore(
                    req.body.domains,
                    req.body.value
                );
            }

            return res.status(200).send();
        } catch (err) {
            if (err instanceof DomainControllerException) {
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
