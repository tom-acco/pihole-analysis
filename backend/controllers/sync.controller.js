const schedule = require("node-schedule");

const ClientController = require("../controllers/client.controller");
const DomainController = require("../controllers/domain.controller");
const QueryController = require("../controllers/query.controller");

const { SyncService } = require("../service/sync.service");
//eslint-disable-next-line
const { SyncControllerException } = require("../classes/Errors");

const downloadFile = require("../utils/download");
const decryptFile = require("../utils/decrypt");

module.exports = class SyncController {
    constructor(database) {
        this.database = database;

        this.piHoleURL = process.env.PIHOLE_URL ?? "127.0.0.1";
        this.piHoleDumpPort = process.env.PIHOLE_DUMP_PORT ?? "8888";
        this.piHoleDumpKey = process.env.PIHOLE_DUMP_KEY ?? "PASSWORD";

        this.clientController = new ClientController(database);
        this.domainController = new DomainController(database);
        this.queryController = new QueryController(database);

        this.syncService = new SyncService(this.database);
    }

    async getLast100() {
        const result = await this.syncService.getWithLimit(100);
        return result;
    }

    async log(syncLog) {
        const result = await this.syncService.create(syncLog);
        return result;
    }

    async syncNow() {
        const ct = await downloadFile(
            `${this.piHoleURL}:${this.piHoleDumpPort}/data`
        );
        const pt = decryptFile(ct, this.piHoleDumpKey);

        const data = JSON.parse(pt);

        const syncLog = {
            startTime: new Date(),
            clients: 0,
            domains: 0,
            queries: 0
        };

        for (const item of data) {
            const [client, isNewClient] =
                await this.clientController.createIfNotExist(item.client);
            const [domain, isNewDomain] =
                await this.domainController.createIfNotExist(item.domain);

            await client.addDomain(domain);

            const [query, isNewQuery] =
                await this.queryController.createIfNotExist(client, domain, {
                    piHoleId: item.id,
                    timestamp: new Date(item.timestamp * 1000)
                });

            if (isNewClient) {
                syncLog.clients++;
            }

            if (isNewDomain) {
                syncLog.domains++;
            }

            if (isNewQuery) {
                syncLog.queries++;
            }
        }

        syncLog.endTime = new Date();
        await this.log(syncLog);
    }

    async startSyncSchedule(cron) {
        schedule.scheduleJob(cron, async () => {
            try {
                await this.syncNow();
            } catch (err) {
                console.error(err);
            }
        });
    }
};
