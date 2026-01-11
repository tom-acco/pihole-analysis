import request from "supertest";
import type { Express } from "express";
import { createTestApp } from "./app.js";
import {
    setupTestDatabase,
    cleanupTestDatabase,
    clearTestDatabase
} from "./setup.js";
import { Client } from "../models/client.model.js";
import { Domain } from "../models/domain.model.js";

describe("Client Routes", () => {
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

    describe("GET /api/clients", () => {
        it("should return empty array when no clients exist", async () => {
            const response = await request(app).get("/api/clients");

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                rows: [],
                count: 0
            });
        });

        it("should return all clients", async () => {
            await Client.create({ ipaddress: "192.168.1.1" });
            await Client.create({ ipaddress: "192.168.1.2" });

            const response = await request(app).get("/api/clients");

            expect(response.status).toBe(200);
            expect(response.body.count).toBe(2);
            expect(response.body.rows).toHaveLength(2);
        });

        it("should support pagination", async () => {
            for (let i = 1; i <= 15; i++) {
                await Client.create({ ipaddress: `192.168.1.${i}` });
            }

            const response = await request(app)
                .get("/api/clients")
                .query({ page: 1, itemsPerPage: 10 });

            expect(response.status).toBe(200);
            expect(response.body.count).toBe(15);
            expect(response.body.rows).toHaveLength(10);
        });

        it("should support search by IP address", async () => {
            await Client.create({ ipaddress: "192.168.1.1" });
            await Client.create({ ipaddress: "10.0.0.1" });

            const response = await request(app)
                .get("/api/clients")
                .query({ search: "192.168" });

            expect(response.status).toBe(200);
            expect(response.body.count).toBe(1);
            expect(response.body.rows[0].ipaddress).toBe("192.168.1.1");
        });

        it("should support search by alias", async () => {
            await Client.create({
                ipaddress: "192.168.1.1",
                alias: "Home Router"
            });
            await Client.create({
                ipaddress: "192.168.1.2",
                alias: "Office PC"
            });

            const response = await request(app)
                .get("/api/clients")
                .query({ search: "Router" });

            expect(response.status).toBe(200);
            expect(response.body.count).toBe(1);
            expect(response.body.rows[0].alias).toBe("Home Router");
        });

        it("should support sorting by IP address", async () => {
            await Client.create({ ipaddress: "192.168.1.2" });
            await Client.create({ ipaddress: "192.168.1.1" });

            const response = await request(app)
                .get("/api/clients")
                .query({
                    "sortBy[0][key]": "ipaddress",
                    "sortBy[0][order]": "asc"
                });

            expect(response.status).toBe(200);
            expect(response.body.rows[0].ipaddress).toBe("192.168.1.1");
            expect(response.body.rows[1].ipaddress).toBe("192.168.1.2");
        });
    });

    describe("GET /api/client", () => {
        it("should return 400 when id is missing", async () => {
            const response = await request(app).get("/api/client");

            expect(response.status).toBe(400);
            expect(response.text).toBe("Missing id parameter");
        });

        it("should return 400 when id is invalid", async () => {
            const response = await request(app)
                .get("/api/client")
                .query({ id: "invalid" });

            expect(response.status).toBe(400);
            expect(response.text).toBe("Invalid id: must be a positive number");
        });

        it("should return 400 when id is negative", async () => {
            const response = await request(app)
                .get("/api/client")
                .query({ id: "-1" });

            expect(response.status).toBe(400);
            expect(response.text).toBe("Invalid id: must be a positive number");
        });

        it("should return 400 when client does not exist", async () => {
            const response = await request(app)
                .get("/api/client")
                .query({ id: "999" });

            expect(response.status).toBe(400);
            expect(response.text).toContain("does not exist");
        });

        it("should return client details", async () => {
            const client = await Client.create({ ipaddress: "192.168.1.1" });

            const response = await request(app)
                .get("/api/client")
                .query({ id: client.id });

            expect(response.status).toBe(200);
            expect(response.body.ipaddress).toBe("192.168.1.1");
        });

        it("should include associated domains", async () => {
            const client = await Client.create({ ipaddress: "192.168.1.1" });
            const domain1 = await Domain.create({ domain: "example.com" });
            const domain2 = await Domain.create({ domain: "test.com" });

            await client.addDomain(domain1);
            await client.addDomain(domain2);

            const response = await request(app)
                .get("/api/client")
                .query({ id: client.id });

            expect(response.status).toBe(200);
            expect(response.body.Domains).toBeDefined();
            expect(response.body.Domains).toHaveLength(2);
        });

        it("should exclude ignored domains", async () => {
            const client = await Client.create({ ipaddress: "192.168.1.1" });
            const domain1 = await Domain.create({ domain: "example.com" });
            const domain2 = await Domain.create({
                domain: "ignored.com",
                ignored: true
            });

            await client.addDomain(domain1);
            await client.addDomain(domain2);

            const response = await request(app)
                .get("/api/client")
                .query({ id: client.id });

            expect(response.status).toBe(200);
            expect(response.body.Domains).toHaveLength(1);
            expect(response.body.Domains[0].domain).toBe("example.com");
        });
    });
});
