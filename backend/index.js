require("dotenv").config();

const setupDatabase = require("./utils/database");
const { startSyncSchedule } = require("./utils/sync");
const startWeb = require("./utils/web");

async function run() {
    const database = await setupDatabase();

    const piHoleURL = process.env.PIHOLE_URL ?? "127.0.0.1";
    const piHoleDumpPort = process.env.PIHOLE_DUMP_PORT ?? "8888";
    const piHoleDumpKey = process.env.PIHOLE_DUMP_KEY ?? "PASSWORD";

    await startSyncSchedule(
        {
            url: `${piHoleURL}:${piHoleDumpPort}/data`,
            key: piHoleDumpKey
        },
        database
    );

    await startWeb(database);
}

run();
