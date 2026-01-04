const schedule = require("node-schedule");

const ClientController = require("../controllers/client.controller");
const DomainController = require("../controllers/domain.controller");
const LookupController = require("../controllers/lookup.controller");

const downloadFile = require("./download");
const decryptFile = require("./decrypt");

const syncNow = async (file, database) => {
    const clientController = new ClientController(database);
    const domainController = new DomainController(database);
    const lookupController = new LookupController(database);

    try {
        const ct = await downloadFile(file.url);
        const pt = decryptFile(ct, file.key);

        const data = JSON.parse(pt);

        for (const item of data) {
            const client = await clientController.createIfNotExist(item.client);
            const domain = await domainController.createIfNotExist(item.domain);

            await client.addDomain(domain);

            await lookupController.create(client, domain, item.count);
        }
    } catch (err) {
        console.error("Error:", err.message);
    }
};

const startSyncSchedule = async (file, database) => {
    // At 00:30 every day
    schedule.scheduleJob("30 0 * * *", async () => {
        await syncNow(file, database);
    });
};

exports.startSyncSchedule = startSyncSchedule;
exports.syncNow = syncNow;
