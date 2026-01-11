import type { Request } from "express";
import { parsePagination } from "../utils/routes.js";
import {
    ClientControllerException,
    DomainControllerException,
    QueryControllerException,
    SyncControllerException
} from "../utils/exceptions.js";

describe("Utils", () => {
    describe("parsePagination", () => {
        let mockReq: Partial<Request>;

        beforeEach(() => {
            mockReq = {
                query: {}
            };
        });

        it("should return undefined for all fields when query is empty", () => {
            const result = parsePagination(mockReq as Request);

            expect(result.search).toBeUndefined();
            expect(result.page).toBeUndefined();
            expect(result.itemsPerPage).toBeUndefined();
            expect(result.sortBy).toBeUndefined();
        });

        it("should parse search string", () => {
            mockReq.query = { search: "example" };

            const result = parsePagination(mockReq as Request);

            expect(result.search).toBe("example");
        });

        it("should ignore non-string search values", () => {
            mockReq.query = { search: 123 as any };

            const result = parsePagination(mockReq as Request);

            expect(result.search).toBeUndefined();
        });

        it("should parse page number", () => {
            mockReq.query = { page: "2" };

            const result = parsePagination(mockReq as Request);

            expect(result.page).toBe(2);
        });

        it("should parse itemsPerPage", () => {
            mockReq.query = { itemsPerPage: "25" };

            const result = parsePagination(mockReq as Request);

            expect(result.itemsPerPage).toBe(25);
        });

        it("should handle invalid page number", () => {
            mockReq.query = { page: "invalid" };

            const result = parsePagination(mockReq as Request);

            expect(isNaN(result.page as number)).toBe(true);
        });

        it("should parse sortBy array from qs format", () => {
            mockReq.query = {
                sortBy: [
                    { key: "domain", order: "asc" },
                    { key: "risk", order: "desc" }
                ]
            };

            const result = parsePagination(mockReq as Request);

            expect(result.sortBy).toHaveLength(2);
            if (result.sortBy && result.sortBy.length >= 2) {
                expect(result.sortBy[0]!.key).toBe("domain");
                expect(result.sortBy[0]!.order).toBe("asc");
                expect(result.sortBy[1]!.key).toBe("risk");
                expect(result.sortBy[1]!.order).toBe("desc");
            }
        });

        it("should filter out invalid sortBy items", () => {
            mockReq.query = {
                sortBy: [
                    { key: "domain", order: "asc" },
                    { key: "invalid" }, // missing order
                    { order: "desc" }, // missing key
                    { key: "name", order: "invalid" } // invalid order
                ]
            };

            const result = parsePagination(mockReq as Request);

            expect(result.sortBy).toHaveLength(1);
            if (result.sortBy && result.sortBy.length >= 1) {
                expect(result.sortBy[0]!.key).toBe("domain");
            }
        });

        it("should handle empty sortBy array", () => {
            mockReq.query = { sortBy: [] };

            const result = parsePagination(mockReq as Request);

            expect(result.sortBy).toEqual([]);
        });

        it("should handle single sortBy object", () => {
            mockReq.query = {
                sortBy: [{ key: "domain", order: "asc" }]
            };

            const result = parsePagination(mockReq as Request);

            expect(result.sortBy).toHaveLength(1);
        });

        it("should validate order is asc or desc", () => {
            mockReq.query = {
                sortBy: [
                    { key: "domain", order: "asc" },
                    { key: "risk", order: "ascending" } // invalid
                ]
            };

            const result = parsePagination(mockReq as Request);

            expect(result.sortBy).toHaveLength(1);
            if (result.sortBy && result.sortBy.length >= 1) {
                expect(result.sortBy[0]!.key).toBe("domain");
            }
        });

        it("should handle non-array sortBy", () => {
            mockReq.query = { sortBy: "invalid" };

            const result = parsePagination(mockReq as Request);

            expect(result.sortBy).toBeUndefined();
        });

        it("should parse all parameters together", () => {
            mockReq.query = {
                search: "test",
                page: "3",
                itemsPerPage: "50",
                sortBy: [{ key: "domain", order: "desc" }]
            };

            const result = parsePagination(mockReq as Request);

            expect(result.search).toBe("test");
            expect(result.page).toBe(3);
            expect(result.itemsPerPage).toBe(50);
            expect(result.sortBy).toHaveLength(1);
        });

        it("should handle sortBy items without proper structure", () => {
            mockReq.query = {
                sortBy: ["not an object", { key: "domain", order: "asc" }]
            };

            const result = parsePagination(mockReq as Request);

            expect(result.sortBy).toHaveLength(1);
            if (result.sortBy && result.sortBy.length >= 1) {
                expect(result.sortBy[0]!.key).toBe("domain");
            }
        });
    });

    describe("Exception Classes", () => {
        describe("ClientControllerException", () => {
            it("should create exception with default status 400", () => {
                const error = new ClientControllerException("Test error");

                expect(error.message).toBe("Test error");
                expect(error.status).toBe(400);
                expect(error.name).toBe("ClientControllerException");
            });

            it("should create exception with custom status", () => {
                const error = new ClientControllerException("Not found", 404);

                expect(error.message).toBe("Not found");
                expect(error.status).toBe(404);
            });

            it("should be instance of Error", () => {
                const error = new ClientControllerException("Test");

                expect(error).toBeInstanceOf(Error);
                expect(error).toBeInstanceOf(ClientControllerException);
            });

            it("should have stack trace", () => {
                const error = new ClientControllerException("Test");

                expect(error.stack).toBeDefined();
                expect(error.stack).toContain("ClientControllerException");
            });
        });

        describe("DomainControllerException", () => {
            it("should create exception with default status 400", () => {
                const error = new DomainControllerException("Test error");

                expect(error.message).toBe("Test error");
                expect(error.status).toBe(400);
                expect(error.name).toBe("DomainControllerException");
            });

            it("should create exception with custom status", () => {
                const error = new DomainControllerException(
                    "Server error",
                    500
                );

                expect(error.status).toBe(500);
            });
        });

        describe("QueryControllerException", () => {
            it("should create exception with default status 400", () => {
                const error = new QueryControllerException("Test error");

                expect(error.message).toBe("Test error");
                expect(error.status).toBe(400);
                expect(error.name).toBe("QueryControllerException");
            });

            it("should create exception with custom status", () => {
                const error = new QueryControllerException("Forbidden", 403);

                expect(error.status).toBe(403);
            });
        });

        describe("SyncControllerException", () => {
            it("should create exception with default status 400", () => {
                const error = new SyncControllerException("Test error");

                expect(error.message).toBe("Test error");
                expect(error.status).toBe(400);
                expect(error.name).toBe("SyncControllerException");
            });

            it("should create exception with custom status", () => {
                const error = new SyncControllerException(
                    "Internal error",
                    500
                );

                expect(error.status).toBe(500);
            });
        });

        describe("Exception inheritance", () => {
            it("should allow catching base Error", () => {
                const error = new ClientControllerException("Test");

                try {
                    throw error;
                } catch (e) {
                    expect(e).toBeInstanceOf(Error);
                    if (e instanceof ClientControllerException) {
                        expect(e.status).toBe(400);
                    }
                }
            });

            it("should distinguish between different exception types", () => {
                const clientError = new ClientControllerException("Client");
                const domainError = new DomainControllerException("Domain");

                expect(clientError).toBeInstanceOf(ClientControllerException);
                expect(clientError).not.toBeInstanceOf(
                    DomainControllerException
                );

                expect(domainError).toBeInstanceOf(DomainControllerException);
                expect(domainError).not.toBeInstanceOf(
                    ClientControllerException
                );
            });
        });
    });
});
