import request from "supertest";
import type { Express } from "express";
import { createTestApp } from "./app.js";
import {
    setupTestDatabase,
    cleanupTestDatabase,
    clearTestDatabase
} from "./setup.js";
import { Domain } from "../models/domain.model.js";
import { Client } from "../models/client.model.js";

describe("Domain Routes", () => {
    let app: Express;

    beforeAll(async () => {
        await setupTestDatabase();
        app = createTestApp();
    });

    afterAll(async () => {
        await cleanupTestDatabase();
    });

    beforeEach(async () => {
        await clearTestDatabase();
    });

    describe("GET /api/domains", () => {
        it("should return empty array when no domains exist", async () => {
            const response = await request(app).get("/api/domains");

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                rows: [],
                count: 0
            });
        });

        it("should return all non-ignored domains", async () => {
            await Domain.create({ domain: "example.com" });
            await Domain.create({ domain: "test.com" });
            await Domain.create({ domain: "ignored.com", ignored: true });

            const response = await request(app).get("/api/domains");

            expect(response.status).toBe(200);
            expect(response.body.count).toBe(2);
            expect(response.body.rows).toHaveLength(2);
        });

        it("should support pagination", async () => {
            for (let i = 1; i <= 15; i++) {
                await Domain.create({ domain: `example${i}.com` });
            }

            const response = await request(app)
                .get("/api/domains")
                .query({ page: 1, itemsPerPage: 10 });

            expect(response.status).toBe(200);
            expect(response.body.count).toBe(15);
            expect(response.body.rows).toHaveLength(10);
        });

        it("should support search by domain name", async () => {
            await Domain.create({ domain: "example.com" });
            await Domain.create({ domain: "test.com" });

            const response = await request(app)
                .get("/api/domains")
                .query({ search: "example" });

            expect(response.status).toBe(200);
            expect(response.body.count).toBe(1);
            expect(response.body.rows[0].domain).toBe("example.com");
        });
    });

    describe("GET /api/domains/new", () => {
        it("should return only new domains", async () => {
            await Domain.create({ domain: "new.com" });
            await Domain.create({
                domain: "acknowledged.com",
                acknowledged: true
            });
            await Domain.create({ domain: "flagged.com", flagged: true });

            const response = await request(app).get("/api/domains/new");

            expect(response.status).toBe(200);
            expect(response.body.count).toBe(1);
            expect(response.body.rows[0].domain).toBe("new.com");
        });
    });

    describe("GET /api/domains/flagged", () => {
        it("should return only flagged domains", async () => {
            await Domain.create({ domain: "normal.com" });
            await Domain.create({ domain: "flagged.com", flagged: true });

            const response = await request(app).get("/api/domains/flagged");

            expect(response.status).toBe(200);
            expect(response.body.count).toBe(1);
            expect(response.body.rows[0].domain).toBe("flagged.com");
        });
    });

    describe("GET /api/domains/ignored", () => {
        it("should return only ignored domains", async () => {
            await Domain.create({ domain: "normal.com" });
            await Domain.create({ domain: "ignored.com", ignored: true });

            const response = await request(app).get("/api/domains/ignored");

            expect(response.status).toBe(200);
            expect(response.body.count).toBe(1);
            expect(response.body.rows[0].domain).toBe("ignored.com");
        });
    });

    describe("GET /api/domain", () => {
        it("should return 400 when id is missing", async () => {
            const response = await request(app).get("/api/domain");

            expect(response.status).toBe(400);
            expect(response.text).toBe("Missing id parameter");
        });

        it("should return 400 when id is invalid", async () => {
            const response = await request(app)
                .get("/api/domain")
                .query({ id: "invalid" });

            expect(response.status).toBe(400);
            expect(response.text).toBe("Invalid id: must be a positive number");
        });

        it("should return 400 when domain does not exist", async () => {
            const response = await request(app)
                .get("/api/domain")
                .query({ id: "999" });

            expect(response.status).toBe(400);
        });

        it("should return domain details", async () => {
            const domain = await Domain.create({ domain: "example.com" });

            const response = await request(app)
                .get("/api/domain")
                .query({ id: domain.id });

            expect(response.status).toBe(200);
            expect(response.body.domain).toBe("example.com");
        });

        it("should include associated clients", async () => {
            const domain = await Domain.create({ domain: "example.com" });
            const client1 = await Client.create({ ipaddress: "192.168.1.1" });
            const client2 = await Client.create({ ipaddress: "192.168.1.2" });

            await domain.addClient(client1);
            await domain.addClient(client2);

            const response = await request(app)
                .get("/api/domain")
                .query({ id: domain.id });

            expect(response.status).toBe(200);
            expect(response.body.Clients).toBeDefined();
            expect(response.body.Clients).toHaveLength(2);
        });
    });

    describe("POST /api/domain/interrogate", () => {
        it("should return 400 when domain is missing", async () => {
            const response = await request(app)
                .post("/api/domain/interrogate")
                .send({});

            expect(response.status).toBe(400);
            expect(response.text).toContain("Missing or invalid domain");
        });

        it("should return 400 when domain is empty", async () => {
            const response = await request(app)
                .post("/api/domain/interrogate")
                .send({ domain: "" });

            expect(response.status).toBe(400);
            expect(response.text).toContain("Missing or invalid domain");
        });

        it("should return 400 when domain format is invalid", async () => {
            const response = await request(app)
                .post("/api/domain/interrogate")
                .send({ domain: "invalid domain!" });

            expect(response.status).toBe(400);
            expect(response.text).toContain("Invalid domain format");
        });

        it("should return 400 when domain does not exist", async () => {
            const response = await request(app)
                .post("/api/domain/interrogate")
                .send({ domain: "nonexistent.com" });

            expect(response.status).toBe(400);
            expect(response.text).toContain("does not exist");
        });
    });

    describe("POST /api/domain/acknowledge", () => {
        it("should return 400 when domains is missing", async () => {
            const response = await request(app)
                .post("/api/domain/acknowledge")
                .send({ value: true });

            expect(response.status).toBe(400);
            expect(response.text).toBe("Missing domains in request body");
        });

        it("should return 400 when value is missing", async () => {
            const response = await request(app)
                .post("/api/domain/acknowledge")
                .send({ domains: ["example.com"] });

            expect(response.status).toBe(400);
            expect(response.text).toContain("Missing or invalid value");
        });

        it("should return 400 when value is not boolean", async () => {
            const response = await request(app)
                .post("/api/domain/acknowledge")
                .send({ domains: ["example.com"], value: "true" });

            expect(response.status).toBe(400);
            expect(response.text).toContain("must be boolean");
        });

        it("should acknowledge a single domain", async () => {
            const domain = await Domain.create({ domain: "example.com" });

            const response = await request(app)
                .post("/api/domain/acknowledge")
                .send({ domains: "example.com", value: true });

            expect(response.status).toBe(200);

            const updated = await Domain.findByPk(domain.id);
            expect(updated?.acknowledged).toBe(true);
        });

        it("should acknowledge multiple domains", async () => {
            await Domain.create({ domain: "example.com" });
            await Domain.create({ domain: "test.com" });

            const response = await request(app)
                .post("/api/domain/acknowledge")
                .send({
                    domains: ["example.com", "test.com"],
                    value: true
                });

            expect(response.status).toBe(200);

            const domains = await Domain.findAll();
            expect(domains.every((d) => d.acknowledged)).toBe(true);
        });
    });

    describe("POST /api/domain/flag", () => {
        it("should flag a domain", async () => {
            const domain = await Domain.create({ domain: "example.com" });

            const response = await request(app)
                .post("/api/domain/flag")
                .send({ domains: "example.com", value: true });

            expect(response.status).toBe(200);

            const updated = await Domain.findByPk(domain.id);
            expect(updated?.flagged).toBe(true);
        });

        it("should unflag a domain", async () => {
            const domain = await Domain.create({
                domain: "example.com",
                flagged: true
            });

            const response = await request(app)
                .post("/api/domain/flag")
                .send({ domains: "example.com", value: false });

            expect(response.status).toBe(200);

            const updated = await Domain.findByPk(domain.id);
            expect(updated?.flagged).toBe(false);
        });
    });

    describe("POST /api/domain/ignore", () => {
        it("should ignore a domain", async () => {
            const domain = await Domain.create({ domain: "example.com" });

            const response = await request(app)
                .post("/api/domain/ignore")
                .send({ domains: "example.com", value: true });

            expect(response.status).toBe(200);

            const updated = await Domain.findByPk(domain.id);
            expect(updated?.ignored).toBe(true);
        });

        it("should handle multiple domains", async () => {
            await Domain.create({ domain: "example.com" });
            await Domain.create({ domain: "test.com" });

            const response = await request(app)
                .post("/api/domain/ignore")
                .send({
                    domains: ["example.com", "test.com"],
                    value: true
                });

            expect(response.status).toBe(200);

            const domains = await Domain.findAll();
            expect(domains.every((d) => d.ignored)).toBe(true);
        });
    });
});
