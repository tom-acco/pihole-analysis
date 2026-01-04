const schedule = require("node-schedule");

const ClientController = require("../controllers/client.controller");
const DomainController = require("../controllers/domain.controller");
const QueryController = require("../controllers/query.controller");

const downloadFile = require("./download");
const decryptFile = require("./decrypt");

const syncNow = async (file, database) => {
    const clientController = new ClientController(database);
    const domainController = new DomainController(database);
    const queryController = new QueryController(database);

    try {
        const ct = await downloadFile(file.url);
        const pt = decryptFile(ct, file.key);

        const data = JSON.parse(pt);

        for (const item of data) {
            const client = await clientController.createIfNotExist(item.client);
            const domain = await domainController.createIfNotExist(item.domain);

            await client.addDomain(domain);

            await queryController.createIfNotExist(client, domain, {
                piHoleId: item.id,
                timestamp: new Date(item.timestamp * 1000)
            });
        }
    } catch (err) {
        console.error("Error:", err.message);
    }
};

const startSyncSchedule = async (file, database) => {
    // Every 30 minutes
    schedule.scheduleJob("/30 * * * *", async () => {
        await syncNow(file, database);
    });
};

exports.startSyncSchedule = startSyncSchedule;
exports.syncNow = syncNow;
