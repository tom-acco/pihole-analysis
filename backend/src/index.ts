import path from "path";

import dotenv from "dotenv";
dotenv.config({ path: `${path.join(process.env.INIT_CWD ?? "./", ".env")}` });

import { setupDatabase } from "./utils/database.js";
import { startWeb } from "./utils/web.js";

import { SyncController } from "./controllers/sync.controller.js";

async function run() {
    await setupDatabase();

    const syncController = new SyncController();
    await syncController.endStale();
    syncController.startSyncSchedule("*/30 * * * *");

    await startWeb();
}

run();
