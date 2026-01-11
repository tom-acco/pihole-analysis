import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: `${path.join(process.env.INIT_CWD ?? "./", ".env")}` });

import { SyncController } from "./controllers/sync.controller.js";
import { setupDatabase } from "./database.js";
import { startWeb } from "./web.js";

async function run() {
    await setupDatabase();

    const syncController = new SyncController();
    await syncController.endStale();
    syncController.startSyncSchedule("*/30 * * * *");

    await startWeb();
}

run();
