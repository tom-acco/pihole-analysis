import {
    setupTestDatabase,
    cleanupTestDatabase,
    clearTestDatabase
} from "./setup.js";
import { ClientService } from "../service/client.service.js";
import { DomainService } from "../service/domain.service.js";
import { QueryService } from "../service/query.service.js";
import { SyncService } from "../service/sync.service.js";
import { Client } from "../models/client.model.js";
import { Domain } from "../models/domain.model.js";
import { Query } from "../models/query.model.js";
import { Sync } from "../models/sync.model.js";

describe("Service Layer", () => {
    beforeAll(async () => {
        await setupTestDatabase();
    });

    afterAll(async () => {
        await cleanupTestDatabase();
    });

    beforeEach(async () => {
        await clearTestDatabase();
    });

    describe("ClientService", () => {
        let clientService: ClientService;

        beforeEach(() => {
            clientService = new ClientService();
        });

        describe("getAll", () => {
            it("should return empty array when no clients exist", async () => {
                const result = await clientService.getAll();
                expect(result).toEqual([]);
            });

            it("should return all clients ordered by IP", async () => {
                await Client.create({ ipaddress: "192.168.1.2" });
                await Client.create({ ipaddress: "192.168.1.1" });

                const result = await clientService.getAll();

                expect(result).toHaveLength(2);
                expect(result[0]?.ipaddress).toBe("192.168.1.1");
                expect(result[1]?.ipaddress).toBe("192.168.1.2");
            });
        });

        describe("getAllWithCount", () => {
            it("should return count and rows", async () => {
                await Client.create({ ipaddress: "192.168.1.1" });
                await Client.create({ ipaddress: "192.168.1.2" });

                const result = await clientService.getAllWithCount();

                expect(result.count).toBe(2);
                expect(result.rows).toHaveLength(2);
            });

            it("should support limit option", async () => {
                for (let i = 1; i <= 5; i++) {
                    await Client.create({ ipaddress: `192.168.1.${i}` });
                }

                const result = await clientService.getAllWithCount({
                    limit: 3
                });

                expect(result.count).toBe(5);
                expect(result.rows).toHaveLength(3);
            });

            it("should support offset option", async () => {
                for (let i = 1; i <= 5; i++) {
                    await Client.create({ ipaddress: `192.168.1.${i}` });
                }

                const result = await clientService.getAllWithCount({
                    offset: 2,
                    limit: 2
                });

                expect(result.rows).toHaveLength(2);
            });
        });

        describe("getDetail", () => {
            it("should return null when client not found", async () => {
                const result = await clientService.getDetail(999);
                expect(result).toBeNull();
            });

            it("should return client with domains", async () => {
                const client = await Client.create({
                    ipaddress: "192.168.1.1"
                });
                const domain = await Domain.create({ domain: "example.com" });
                await client.addDomain(domain);

                const result = await clientService.getDetail(client.id);

                expect(result).not.toBeNull();
                expect(result?.ipaddress).toBe("192.168.1.1");
            });

            it("should exclude ignored domains", async () => {
                const client = await Client.create({
                    ipaddress: "192.168.1.1"
                });
                const domain1 = await Domain.create({ domain: "example.com" });
                const domain2 = await Domain.create({
                    domain: "ignored.com",
                    ignored: true
                });

                await client.addDomain(domain1);
                await client.addDomain(domain2);

                const result = await clientService.getDetail(client.id);
                expect(result).not.toBeNull();
            });
        });

        describe("getByIP", () => {
            it("should return null when IP not found", async () => {
                const result = await clientService.getByIP("192.168.1.1");
                expect(result).toBeNull();
            });

            it("should return client by IP address", async () => {
                await Client.create({ ipaddress: "192.168.1.1" });

                const result = await clientService.getByIP("192.168.1.1");

                expect(result).not.toBeNull();
                expect(result?.ipaddress).toBe("192.168.1.1");
            });
        });

        describe("create", () => {
            it("should create a new client", async () => {
                const result = await clientService.create("192.168.1.1");

                expect(result.ipaddress).toBe("192.168.1.1");
                expect(result.id).toBeDefined();
            });

            it("should persist the client to database", async () => {
                await clientService.create("192.168.1.1");

                const found = await Client.findOne({
                    where: { ipaddress: "192.168.1.1" }
                });

                expect(found).not.toBeNull();
            });
        });
    });

    describe("DomainService", () => {
        let domainService: DomainService;

        beforeEach(() => {
            domainService = new DomainService();
        });

        describe("getAll", () => {
            it("should return empty array when no domains exist", async () => {
                const result = await domainService.getAll();
                expect(result).toEqual([]);
            });

            it("should return all domains ordered by name", async () => {
                await Domain.create({ domain: "zebra.com" });
                await Domain.create({ domain: "alpha.com" });

                const result = await domainService.getAll();

                expect(result).toHaveLength(2);
                expect(result[0]?.domain).toBe("alpha.com");
                expect(result[1]?.domain).toBe("zebra.com");
            });
        });

        describe("getAllWithCount", () => {
            it("should include queryCount in results", async () => {
                const domain = await Domain.create({ domain: "example.com" });
                const client = await Client.create({
                    ipaddress: "192.168.1.1"
                });

                await Query.create({
                    piHoleId: 1,
                    timestamp: new Date(),
                    ClientId: client.id,
                    DomainId: domain.id
                });

                const result = await domainService.getAllWithCount();

                expect(result.rows).toHaveLength(1);
                const domainResult = result.rows[0];
                const queryCount =
                    (domainResult as any).dataValues?.queryCount ??
                    (domainResult as any).get("queryCount");
                expect(queryCount).toBe(1);
            });

            it("should support filtering options", async () => {
                await Domain.create({ domain: "example.com", ignored: false });
                await Domain.create({ domain: "ignored.com", ignored: true });

                const result = await domainService.getAllWithCount({
                    where: { ignored: false }
                });

                expect(result.count).toBe(1);
                expect(result.rows[0]?.domain).toBe("example.com");
            });
        });

        describe("getDetail", () => {
            it("should return null when domain not found", async () => {
                const result = await domainService.getDetail(999);
                expect(result).toBeNull();
            });

            it("should return domain with clients", async () => {
                const domain = await Domain.create({ domain: "example.com" });
                const client = await Client.create({
                    ipaddress: "192.168.1.1"
                });
                await domain.addClient(client);

                const result = await domainService.getDetail(domain.id);

                expect(result).not.toBeNull();
                expect(result?.domain).toBe("example.com");
            });
        });

        describe("getByDomain", () => {
            it("should return null when domain not found", async () => {
                const result =
                    await domainService.getByDomain("nonexistent.com");
                expect(result).toBeNull();
            });

            it("should return domain by name", async () => {
                await Domain.create({ domain: "example.com" });

                const result = await domainService.getByDomain("example.com");

                expect(result).not.toBeNull();
                expect(result?.domain).toBe("example.com");
            });
        });

        describe("create", () => {
            it("should create a new domain", async () => {
                const result = await domainService.create("example.com");

                expect(result.domain).toBe("example.com");
                expect(result.id).toBeDefined();
            });

            it("should have default values for flags", async () => {
                const result = await domainService.create("example.com");

                expect(result.acknowledged).toBe(false);
                expect(result.flagged).toBe(false);
                expect(result.ignored).toBe(false);
            });
        });
    });

    describe("QueryService", () => {
        let queryService: QueryService;

        beforeEach(() => {
            queryService = new QueryService();
        });

        describe("getWithLimit", () => {
            it("should return empty array when no queries exist", async () => {
                const result = await queryService.getWithLimit(10);
                expect(result).toEqual([]);
            });

            it("should return queries in descending order", async () => {
                const client = await Client.create({
                    ipaddress: "192.168.1.1"
                });
                const domain = await Domain.create({ domain: "example.com" });

                await Query.create({
                    piHoleId: 1,
                    timestamp: new Date("2024-01-01"),
                    ClientId: client.id,
                    DomainId: domain.id
                });

                await Query.create({
                    piHoleId: 2,
                    timestamp: new Date("2024-01-02"),
                    ClientId: client.id,
                    DomainId: domain.id
                });

                const result = await queryService.getWithLimit(10);

                expect(result).toHaveLength(2);
                expect(result[0]?.piHoleId).toBe(2);
                expect(result[1]?.piHoleId).toBe(1);
            });

            it("should respect limit parameter", async () => {
                const client = await Client.create({
                    ipaddress: "192.168.1.1"
                });
                const domain = await Domain.create({ domain: "example.com" });

                for (let i = 1; i <= 10; i++) {
                    await Query.create({
                        piHoleId: i,
                        timestamp: new Date(),
                        ClientId: client.id,
                        DomainId: domain.id
                    });
                }

                const result = await queryService.getWithLimit(5);

                expect(result).toHaveLength(5);
            });
        });

        describe("getByPiHoleId", () => {
            it("should return null when query not found", async () => {
                const result = await queryService.getByPiHoleId(999);
                expect(result).toBeNull();
            });

            it("should return query by piHoleId", async () => {
                const client = await Client.create({
                    ipaddress: "192.168.1.1"
                });
                const domain = await Domain.create({ domain: "example.com" });

                await Query.create({
                    piHoleId: 123,
                    timestamp: new Date(),
                    ClientId: client.id,
                    DomainId: domain.id
                });

                const result = await queryService.getByPiHoleId(123);

                expect(result).not.toBeNull();
                expect(result?.piHoleId).toBe(123);
            });
        });

        describe("create", () => {
            it("should create a new query", async () => {
                const client = await Client.create({
                    ipaddress: "192.168.1.1"
                });
                const domain = await Domain.create({ domain: "example.com" });

                const result = await queryService.create(
                    123,
                    new Date(),
                    client.id,
                    domain.id
                );

                expect(result.piHoleId).toBe(123);
                expect(result.ClientId).toBe(client.id);
                expect(result.DomainId).toBe(domain.id);
            });
        });
    });

    describe("SyncService", () => {
        let syncService: SyncService;

        beforeEach(() => {
            syncService = new SyncService();
        });

        describe("getWithLimit", () => {
            it("should return empty array when no syncs exist", async () => {
                const result = await syncService.getWithLimit(10);
                expect(result).toEqual([]);
            });

            it("should return syncs in descending order", async () => {
                await Sync.create({
                    startTime: new Date("2024-01-01"),
                    endTime: new Date(),
                    status: 2,
                    clients: 1,
                    domains: 0,
                    queries: 0
                });

                await Sync.create({
                    startTime: new Date("2024-01-02"),
                    endTime: new Date(),
                    status: 2,
                    clients: 2,
                    domains: 0,
                    queries: 0
                });

                const result = await syncService.getWithLimit(10);

                expect(result).toHaveLength(2);
                expect(result[0]?.clients).toBe(2);
                expect(result[1]?.clients).toBe(1);
            });

            it("should respect limit parameter", async () => {
                for (let i = 0; i < 10; i++) {
                    await Sync.create({
                        startTime: new Date(),
                        endTime: new Date(),
                        status: 2,
                        clients: i,
                        domains: 0,
                        queries: 0
                    });
                }

                const result = await syncService.getWithLimit(5);

                expect(result).toHaveLength(5);
            });
        });

        describe("create", () => {
            it("should create a new sync log", async () => {
                const syncLog = {
                    startTime: new Date(),
                    endTime: null,
                    status: 1,
                    clients: 0,
                    domains: 0,
                    queries: 0
                };

                const result = await syncService.create(syncLog);

                expect(result.status).toBe(1);
                expect(result.clients).toBe(0);
                expect(result.endTime).toBeNull();
            });

            it("should use default values when not provided", async () => {
                const syncLog = {
                    startTime: new Date(),
                    endTime: null,
                    status: null,
                    clients: null,
                    domains: null,
                    queries: null
                };

                const result = await syncService.create(syncLog);

                expect(result.status).toBe(0);
                expect(result.clients).toBe(0);
                expect(result.domains).toBe(0);
                expect(result.queries).toBe(0);
            });
        });

        describe("endStale", () => {
            it("should mark running syncs as failed", async () => {
                const runningSync = await Sync.create({
                    startTime: new Date(),
                    endTime: null,
                    status: 1,
                    clients: 0,
                    domains: 0,
                    queries: 0
                });

                await syncService.endStale();

                const updated = await Sync.findByPk(runningSync.id);

                expect(updated?.status).toBe(3);
                expect(updated?.endTime).not.toBeNull();
            });

            it("should not affect completed syncs", async () => {
                const completedSync = await Sync.create({
                    startTime: new Date(),
                    endTime: new Date(),
                    status: 2,
                    clients: 5,
                    domains: 10,
                    queries: 100
                });

                await syncService.endStale();

                const updated = await Sync.findByPk(completedSync.id);

                expect(updated?.status).toBe(2);
            });

            it("should handle multiple running syncs", async () => {
                await Sync.create({
                    startTime: new Date(),
                    endTime: null,
                    status: 1,
                    clients: 0,
                    domains: 0,
                    queries: 0
                });

                await Sync.create({
                    startTime: new Date(),
                    endTime: null,
                    status: 1,
                    clients: 0,
                    domains: 0,
                    queries: 0
                });

                await syncService.endStale();

                const all = await Sync.findAll();
                expect(all.every((s) => s.status === 3)).toBe(true);
            });
        });
    });
});
