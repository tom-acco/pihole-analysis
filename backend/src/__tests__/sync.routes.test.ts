import request from "supertest";
import type { Express } from "express";
import { createTestApp } from "./app.js";
import {
    setupTestDatabase,
    cleanupTestDatabase,
    clearTestDatabase
} from "./setup.js";
import { Sync } from "../models/sync.model.js";

describe("Sync Routes", () => {
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

    describe("GET /api/sync", () => {
        it("should return empty array when no sync logs exist", async () => {
            const response = await request(app).get("/api/sync");

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });

        it("should return sync logs", async () => {
            await Sync.create({
                startTime: new Date(),
                endTime: new Date(),
                status: 2,
                clients: 5,
                domains: 10,
                queries: 100
            });

            const response = await request(app).get("/api/sync");

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].status).toBe(2);
            expect(response.body[0].clients).toBe(5);
        });

        it("should return last 100 sync logs", async () => {
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

            const response = await request(app).get("/api/sync");

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(100);
        });

        it("should return sync logs in descending order", async () => {
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

            const response = await request(app).get("/api/sync");

            expect(response.status).toBe(200);
            expect(response.body[0].clients).toBe(2);
            expect(response.body[1].clients).toBe(1);
        });

        it("should include status field", async () => {
            await Sync.create({
                startTime: new Date(),
                endTime: null,
                status: 1,
                clients: 0,
                domains: 0,
                queries: 0
            });

            const response = await request(app).get("/api/sync");

            expect(response.status).toBe(200);
            expect(response.body[0].status).toBe(1);
        });
    });

    describe("POST /api/sync", () => {
        // Note: These tests are skipped because POST /api/sync triggers actual
        // sync operations that require a Pi-hole server connection.
        // In a production test suite, you would mock the SyncController.syncNow() method.

        it.skip("should accept sync request", async () => {
            const response = await request(app).post("/api/sync").send({});

            expect(response.status).toBe(200);
        });

        it.skip("should respond after 500ms delay", async () => {
            const start = Date.now();
            await request(app).post("/api/sync").send({});
            const duration = Date.now() - start;

            expect(duration).toBeGreaterThanOrEqual(500);
        });
    });
});
