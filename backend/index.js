require("dotenv").config();

const setupDatabase = require("./utils/database");
const startWeb = require("./utils/web");

const SyncController = require("./controllers/sync.controller");

async function run() {
    const database = await setupDatabase();

    const syncController = new SyncController(database);
    syncController.startSyncSchedule("/30 * * * *");

    await startWeb(database);
}

run();
