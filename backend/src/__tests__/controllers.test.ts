import {
    setupTestDatabase,
    cleanupTestDatabase,
    clearTestDatabase
} from "./setup.js";
import { ClientController } from "../controllers/client.controller.js";
import { DomainController } from "../controllers/domain.controller.js";
import { QueryController } from "../controllers/query.controller.js";
import { SyncController } from "../controllers/sync.controller.js";
import { Client } from "../models/client.model.js";
import { Domain } from "../models/domain.model.js";
import { Query } from "../models/query.model.js";
import { Sync } from "../models/sync.model.js";
import {
    ClientControllerException,
    DomainControllerException
} from "../utils/exceptions.js";

describe("Controller Layer", () => {
    beforeAll(async () => {
        await setupTestDatabase();
    });

    afterAll(async () => {
        await cleanupTestDatabase();
    });

    beforeEach(async () => {
        await clearTestDatabase();
    });

    describe("ClientController", () => {
        let clientController: ClientController;

        beforeEach(() => {
            clientController = new ClientController();
        });

        describe("getAllPaginated", () => {
            it("should return all clients without filters", async () => {
                await Client.create({ ipaddress: "192.168.1.1" });
                await Client.create({ ipaddress: "192.168.1.2" });

                const result = await clientController.getAllPaginated();

                expect(result.count).toBe(2);
                expect(result.rows).toHaveLength(2);
            });

            it("should filter clients by IP address", async () => {
                await Client.create({ ipaddress: "192.168.1.1" });
                await Client.create({ ipaddress: "10.0.0.1" });

                const result = await clientController.getAllPaginated("192.168");

                expect(result.count).toBe(1);
                expect(result.rows).toHaveLength(1);
                expect(result.rows[0]?.ipaddress).toBe("192.168.1.1");
            });

            it("should filter clients by alias", async () => {
                await Client.create({
                    ipaddress: "192.168.1.1",
                    alias: "Home PC"
                });
                await Client.create({
                    ipaddress: "192.168.1.2",
                    alias: "Work Laptop"
                });

                const result = await clientController.getAllPaginated("Laptop");

                expect(result.count).toBe(1);
                expect(result.rows).toHaveLength(1);
                expect(result.rows[0]?.alias).toBe("Work Laptop");
            });

            it("should paginate results", async () => {
                for (let i = 1; i <= 10; i++) {
                    await Client.create({ ipaddress: `192.168.1.${i}` });
                }

                const result = await clientController.getAllPaginated(
                    undefined,
                    2,
                    5
                );

                expect(result.count).toBe(10);
                expect(result.rows).toHaveLength(5);
            });

            it("should sort by IP address ascending", async () => {
                await Client.create({ ipaddress: "192.168.1.3" });
                await Client.create({ ipaddress: "192.168.1.1" });
                await Client.create({ ipaddress: "192.168.1.2" });

                const result = await clientController.getAllPaginated(
                    undefined,
                    undefined,
                    undefined,
                    [{ key: "ipaddress", order: "asc" }]
                );

                expect(result.rows).toHaveLength(3);
                expect(result.rows[0]?.ipaddress).toBe("192.168.1.1");
                expect(result.rows[2]?.ipaddress).toBe("192.168.1.3");
            });

            it("should sort by IP address descending", async () => {
                await Client.create({ ipaddress: "192.168.1.1" });
                await Client.create({ ipaddress: "192.168.1.3" });

                const result = await clientController.getAllPaginated(
                    undefined,
                    undefined,
                    undefined,
                    [{ key: "ipaddress", order: "desc" }]
                );

                expect(result.rows).toHaveLength(2);
                expect(result.rows[0]?.ipaddress).toBe("192.168.1.3");
                expect(result.rows[1]?.ipaddress).toBe("192.168.1.1");
            });

            it("should ignore invalid sort columns", async () => {
                await Client.create({ ipaddress: "192.168.1.1" });

                const result = await clientController.getAllPaginated(
                    undefined,
                    undefined,
                    undefined,
                    [{ key: "invalid" as any, order: "asc" }]
                );

                expect(result.rows).toHaveLength(1);
            });

            it("should ignore invalid sort orders", async () => {
                await Client.create({ ipaddress: "192.168.1.1" });

                const result = await clientController.getAllPaginated(
                    undefined,
                    undefined,
                    undefined,
                    [{ key: "ipaddress", order: "invalid" as any }]
                );

                expect(result.rows).toHaveLength(1);
            });
        });

        describe("getClientDomains", () => {
            it("should return client with domains", async () => {
                const client = await Client.create({
                    ipaddress: "192.168.1.1"
                });
                const domain = await Domain.create({ domain: "example.com" });
                await client.addDomain(domain);

                const result = await clientController.getClientDomains(
                    client.id
                );

                expect(result).not.toBeNull();
                expect(result?.ipaddress).toBe("192.168.1.1");
            });

            it("should throw exception when client not found", async () => {
                await expect(
                    clientController.getClientDomains(999)
                ).rejects.toThrow(ClientControllerException);
            });
        });

        describe("createIfNotExist", () => {
            it("should create new client when not exists", async () => {
                const [client, isNew] =
                    await clientController.createIfNotExist("192.168.1.1");

                expect(isNew).toBe(true);
                expect(client.ipaddress).toBe("192.168.1.1");
            });

            it("should return existing client when exists", async () => {
                const existing = await Client.create({
                    ipaddress: "192.168.1.1"
                });

                const [client, isNew] =
                    await clientController.createIfNotExist("192.168.1.1");

                expect(isNew).toBe(false);
                expect(client.id).toBe(existing.id);
            });
        });
    });

    describe("DomainController", () => {
        let domainController: DomainController;

        beforeEach(() => {
            domainController = new DomainController();
        });

        describe("getAllPaginated", () => {
            it("should return all domains without filters", async () => {
                await Domain.create({ domain: "example.com" });
                await Domain.create({ domain: "test.com" });

                const result = await domainController.getAllPaginated();

                expect(result.count).toBe(2);
                expect(result.rows).toHaveLength(2);
            });

            it("should filter domains by name", async () => {
                await Domain.create({ domain: "example.com" });
                await Domain.create({ domain: "test.com" });

                const result =
                    await domainController.getAllPaginated("example");

                expect(result.count).toBe(1);
                expect(result.rows).toHaveLength(1);
                expect(result.rows[0]?.domain).toBe("example.com");
            });

            it("should filter domains by category", async () => {
                await Domain.create({
                    domain: "example.com",
                    category: "Social Media"
                });
                await Domain.create({
                    domain: "test.com",
                    category: "Shopping"
                });

                const result =
                    await domainController.getAllPaginated("Social");

                expect(result.count).toBe(1);
                expect(result.rows).toHaveLength(1);
                expect(result.rows[0]?.category).toBe("Social Media");
            });

            it("should filter domains by owner", async () => {
                await Domain.create({
                    domain: "example.com",
                    owner: "Google"
                });
                await Domain.create({ domain: "test.com", owner: "Amazon" });

                const result = await domainController.getAllPaginated("Google");

                expect(result.count).toBe(1);
                expect(result.rows).toHaveLength(1);
                expect(result.rows[0]?.owner).toBe("Google");
            });

            it("should paginate results", async () => {
                for (let i = 1; i <= 10; i++) {
                    await Domain.create({ domain: `example${i}.com` });
                }

                const result = await domainController.getAllPaginated(
                    null,
                    2,
                    5
                );

                expect(result.count).toBe(10);
                expect(result.rows).toHaveLength(5);
            });

            it("should sort by domain name", async () => {
                await Domain.create({ domain: "zebra.com" });
                await Domain.create({ domain: "alpha.com" });

                const result = await domainController.getAllPaginated(
                    null,
                    undefined,
                    undefined,
                    [{ key: "domain", order: "asc" }]
                );

                expect(result.rows).toHaveLength(2);
                expect(result.rows[0]?.domain).toBe("alpha.com");
                expect(result.rows[1]?.domain).toBe("zebra.com");
            });

            it("should ignore invalid sort columns", async () => {
                await Domain.create({ domain: "example.com" });

                const result = await domainController.getAllPaginated(
                    null,
                    undefined,
                    undefined,
                    [{ key: "invalid" as any, order: "asc" }]
                );

                expect(result.rows).toHaveLength(1);
            });
        });

        describe("getDomainClients", () => {
            it("should return domain with clients", async () => {
                const domain = await Domain.create({ domain: "example.com" });
                const client = await Client.create({
                    ipaddress: "192.168.1.1"
                });
                await domain.addClient(client);

                const result = await domainController.getDomainClients(
                    domain.id
                );

                expect(result).not.toBeNull();
                expect(result?.domain).toBe("example.com");
            });

            it("should throw exception when domain not found", async () => {
                await expect(
                    domainController.getDomainClients(999)
                ).rejects.toThrow(DomainControllerException);
            });
        });

        describe("createIfNotExist", () => {
            it("should create new domain when not exists", async () => {
                const [domain, isNew] =
                    await domainController.createIfNotExist("example.com");

                expect(isNew).toBe(true);
                expect(domain.domain).toBe("example.com");
            });

            it("should return existing domain when exists", async () => {
                const existing = await Domain.create({ domain: "example.com" });

                const [domain, isNew] =
                    await domainController.createIfNotExist("example.com");

                expect(isNew).toBe(false);
                expect(domain.id).toBe(existing.id);
            });
        });

        describe("setAcknowledge", () => {
            it("should set acknowledge to true", async () => {
                await Domain.create({ domain: "example.com" });

                const result = await domainController.setAcknowledge(
                    "example.com",
                    true
                );

                expect(result.acknowledged).toBe(true);
            });

            it("should set acknowledge to false", async () => {
                await Domain.create({
                    domain: "example.com",
                    acknowledged: true
                });

                const result = await domainController.setAcknowledge(
                    "example.com",
                    false
                );

                expect(result.acknowledged).toBe(false);
            });

            it("should throw exception when domain not found", async () => {
                await expect(
                    domainController.setAcknowledge("nonexistent.com", true)
                ).rejects.toThrow(DomainControllerException);
            });
        });

        describe("setFlag", () => {
            it("should set flagged to true", async () => {
                await Domain.create({ domain: "example.com" });

                const result = await domainController.setFlag(
                    "example.com",
                    true
                );

                expect(result.flagged).toBe(true);
            });

            it("should set flagged to false", async () => {
                await Domain.create({ domain: "example.com", flagged: true });

                const result = await domainController.setFlag(
                    "example.com",
                    false
                );

                expect(result.flagged).toBe(false);
            });

            it("should throw exception when domain not found", async () => {
                await expect(
                    domainController.setFlag("nonexistent.com", true)
                ).rejects.toThrow(DomainControllerException);
            });
        });

        describe("setIgnore", () => {
            it("should set ignored to true", async () => {
                await Domain.create({ domain: "example.com" });

                const result = await domainController.setIgnore(
                    "example.com",
                    true
                );

                expect(result.ignored).toBe(true);
            });

            it("should set ignored to false", async () => {
                await Domain.create({ domain: "example.com", ignored: true });

                const result = await domainController.setIgnore(
                    "example.com",
                    false
                );

                expect(result.ignored).toBe(false);
            });

            it("should throw exception when domain not found", async () => {
                await expect(
                    domainController.setIgnore("nonexistent.com", true)
                ).rejects.toThrow(DomainControllerException);
            });
        });
    });

    describe("QueryController", () => {
        let queryController: QueryController;
        let client: Client;
        let domain: Domain;

        beforeEach(async () => {
            queryController = new QueryController();
            client = await Client.create({ ipaddress: "192.168.1.1" });
            domain = await Domain.create({ domain: "example.com" });
        });

        describe("getLast", () => {
            it("should return null when no queries exist", async () => {
                const result = await queryController.getLast();
                expect(result).toBeNull();
            });

            it("should return last query", async () => {
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

                const result = await queryController.getLast();

                expect(result).not.toBeNull();
                expect(result?.piHoleId).toBe(2);
            });
        });

        describe("createIfNotExist", () => {
            it("should create new query when not exists", async () => {
                const [query, isNew] = await queryController.createIfNotExist(
                    client.id,
                    domain.id,
                    {
                        piHoleId: 123,
                        timestamp: new Date()
                    }
                );

                expect(isNew).toBe(true);
                expect(query.piHoleId).toBe(123);
            });

            it("should return existing query when exists", async () => {
                const existing = await Query.create({
                    piHoleId: 123,
                    timestamp: new Date(),
                    ClientId: client.id,
                    DomainId: domain.id
                });

                const [query, isNew] = await queryController.createIfNotExist(
                    client.id,
                    domain.id,
                    {
                        piHoleId: 123,
                        timestamp: new Date()
                    }
                );

                expect(isNew).toBe(false);
                expect(query.id).toBe(existing.id);
            });
        });
    });

    describe("SyncController", () => {
        let syncController: SyncController;

        beforeEach(() => {
            syncController = new SyncController();
        });

        describe("getLast", () => {
            it("should return null when no syncs exist", async () => {
                const result = await syncController.getLast();
                expect(result).toBeNull();
            });

            it("should return last sync", async () => {
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

                const result = await syncController.getLast();

                expect(result).not.toBeNull();
                expect(result?.clients).toBe(2);
            });
        });

        describe("getLast100", () => {
            it("should return empty array when no syncs exist", async () => {
                const result = await syncController.getLast100();
                expect(result).toEqual([]);
            });

            it("should return up to 100 syncs", async () => {
                for (let i = 0; i < 150; i++) {
                    await Sync.create({
                        startTime: new Date(),
                        endTime: new Date(),
                        status: 2,
                        clients: i,
                        domains: 0,
                        queries: 0
                    });
                }

                const result = await syncController.getLast100();

                expect(result).toHaveLength(100);
            });
        });

        describe("log", () => {
            it("should create a new sync log", async () => {
                const syncLog = {
                    startTime: new Date(),
                    endTime: null,
                    status: 1,
                    clients: 0,
                    domains: 0,
                    queries: 0
                };

                const result = await syncController.log(syncLog);

                expect(result.status).toBe(1);
                expect(result.clients).toBe(0);
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

                await syncController.endStale();

                const updated = await Sync.findByPk(runningSync.id);
                expect(updated?.status).toBe(3);
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

                await syncController.endStale();

                const updated = await Sync.findByPk(completedSync.id);
                expect(updated?.status).toBe(2);
            });
        });
    });
});
