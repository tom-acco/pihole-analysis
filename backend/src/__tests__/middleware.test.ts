import type { Request, Response, NextFunction } from "express";
import {
    validateId,
    validateDomain,
    validateBulkDomainUpdate
} from "../middleware/validation.middleware.js";
import {
    validateDomainFormat,
    validateBulkDomainsFormat
} from "../middleware/domain-validator.middleware.js";
import { asyncHandler } from "../middleware/error-handler.middleware.js";
import {
    ClientControllerException,
    DomainControllerException,
    SyncControllerException
} from "../utils/exceptions.js";

describe("Validation Middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    let statusCalled: number | null;
    let sendCalled: string | null;
    let nextCalled: boolean;

    beforeEach(() => {
        statusCalled = null;
        sendCalled = null;
        nextCalled = false;

        mockReq = {
            query: {},
            params: {},
            body: {}
        };
        mockRes = {
            status: function (code: number) {
                statusCalled = code;
                return this;
            },
            send: function (data?: any) {
                sendCalled = data;
                return this;
            }
        } as Partial<Response>;
        mockNext = () => {
            nextCalled = true;
        };
    });

    describe("validateId", () => {
        it("should pass validation with valid query id", () => {
            mockReq.query = { id: "123" };
            const middleware = validateId("query");

            middleware(mockReq as Request, mockRes as Response, mockNext);

            expect(nextCalled).toBe(true);
            expect(statusCalled).toBeNull();
        });

        it("should pass validation with valid params id", () => {
            mockReq.params = { id: "456" };
            const middleware = validateId("params");

            middleware(mockReq as Request, mockRes as Response, mockNext);

            expect(nextCalled).toBe(true);
            expect(statusCalled).toBeNull();
        });

        it("should return 400 when id is missing from query", () => {
            mockReq.query = {};
            const middleware = validateId("query");

            middleware(mockReq as Request, mockRes as Response, mockNext);

            expect(statusCalled).toBe(400);
            expect(sendCalled).toBe("Missing id parameter");
            expect(nextCalled).toBe(false);
        });

        it("should return 400 when id is not a number", () => {
            mockReq.query = { id: "abc" };
            const middleware = validateId("query");

            middleware(mockReq as Request, mockRes as Response, mockNext);

            expect(statusCalled).toBe(400);
            expect(sendCalled).toBe("Invalid id: must be a positive number");
            expect(nextCalled).toBe(false);
        });

        it("should return 400 when id is zero", () => {
            mockReq.query = { id: "0" };
            const middleware = validateId("query");

            middleware(mockReq as Request, mockRes as Response, mockNext);

            expect(statusCalled).toBe(400);
            expect(nextCalled).toBe(false);
        });

        it("should return 400 when id is negative", () => {
            mockReq.query = { id: "-5" };
            const middleware = validateId("query");

            middleware(mockReq as Request, mockRes as Response, mockNext);

            expect(statusCalled).toBe(400);
            expect(nextCalled).toBe(false);
        });
    });

    describe("validateDomain", () => {
        it("should pass validation with valid domain", () => {
            mockReq.body = { domain: "example.com" };

            validateDomain(mockReq as Request, mockRes as Response, mockNext);

            expect(nextCalled).toBe(true);
            expect(statusCalled).toBeNull();
        });

        it("should return 400 when domain is missing", () => {
            mockReq.body = {};

            validateDomain(mockReq as Request, mockRes as Response, mockNext);

            expect(statusCalled).toBe(400);
            expect(sendCalled).toBe(
                "Missing or invalid domain in request body"
            );
            expect(nextCalled).toBe(false);
        });

        it("should return 400 when domain is not a string", () => {
            mockReq.body = { domain: 123 };

            validateDomain(mockReq as Request, mockRes as Response, mockNext);

            expect(statusCalled).toBe(400);
            expect(nextCalled).toBe(false);
        });

        it("should return 400 when domain is empty string", () => {
            mockReq.body = { domain: "" };

            validateDomain(mockReq as Request, mockRes as Response, mockNext);

            expect(statusCalled).toBe(400);
            expect(nextCalled).toBe(false);
        });

        it("should return 400 when domain is only whitespace", () => {
            mockReq.body = { domain: "   " };

            validateDomain(mockReq as Request, mockRes as Response, mockNext);

            expect(statusCalled).toBe(400);
            expect(nextCalled).toBe(false);
        });
    });

    describe("validateBulkDomainUpdate", () => {
        it("should pass validation with single domain string", () => {
            mockReq.body = { domains: "example.com", value: true };

            validateBulkDomainUpdate(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(nextCalled).toBe(true);
            expect(statusCalled).toBeNull();
        });

        it("should pass validation with domain array", () => {
            mockReq.body = {
                domains: ["example.com", "test.com"],
                value: false
            };

            validateBulkDomainUpdate(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(nextCalled).toBe(true);
            expect(statusCalled).toBeNull();
        });

        it("should return 400 when domains is missing", () => {
            mockReq.body = { value: true };

            validateBulkDomainUpdate(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(statusCalled).toBe(400);
            expect(sendCalled).toBe("Missing domains in request body");
            expect(nextCalled).toBe(false);
        });

        it("should return 400 when value is missing", () => {
            mockReq.body = { domains: ["example.com"] };

            validateBulkDomainUpdate(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(statusCalled).toBe(400);
            expect(sendCalled).toBe(
                "Missing or invalid value: must be boolean"
            );
            expect(nextCalled).toBe(false);
        });

        it("should return 400 when value is not boolean", () => {
            mockReq.body = { domains: ["example.com"], value: "true" };

            validateBulkDomainUpdate(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(statusCalled).toBe(400);
            expect(nextCalled).toBe(false);
        });

        it("should return 400 when domains array is empty", () => {
            mockReq.body = { domains: [], value: true };

            validateBulkDomainUpdate(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(statusCalled).toBe(400);
            expect(sendCalled).toBe("Domains array cannot be empty");
            expect(nextCalled).toBe(false);
        });

        it("should return 400 when domain in array is not string", () => {
            mockReq.body = { domains: [123, "example.com"], value: true };

            validateBulkDomainUpdate(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(statusCalled).toBe(400);
            expect(sendCalled).toBe("All domains must be non-empty strings");
            expect(nextCalled).toBe(false);
        });

        it("should return 400 when domain in array is empty", () => {
            mockReq.body = { domains: ["example.com", ""], value: true };

            validateBulkDomainUpdate(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(statusCalled).toBe(400);
            expect(nextCalled).toBe(false);
        });
    });

    describe("validateDomainFormat", () => {
        it("should pass validation with valid domain", () => {
            mockReq.body = { domain: "example.com" };

            validateDomainFormat(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(nextCalled).toBe(true);
            expect(statusCalled).toBeNull();
        });

        it("should pass validation with subdomain", () => {
            mockReq.body = { domain: "api.example.com" };

            validateDomainFormat(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(nextCalled).toBe(true);
        });

        it("should pass validation with localhost", () => {
            mockReq.body = { domain: "localhost" };

            validateDomainFormat(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(nextCalled).toBe(true);
        });

        it("should pass validation with IP address", () => {
            mockReq.body = { domain: "192.168.1.1" };

            validateDomainFormat(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(nextCalled).toBe(true);
        });

        it("should pass validation with port", () => {
            mockReq.body = { domain: "example.com:8080" };

            validateDomainFormat(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(nextCalled).toBe(true);
        });

        it("should return 400 when domain is missing", () => {
            mockReq.body = {};

            validateDomainFormat(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(statusCalled).toBe(400);
            expect(sendCalled).toBe("No domain provided for validation");
            expect(nextCalled).toBe(false);
        });

        it("should return 400 with invalid domain format", () => {
            mockReq.body = { domain: "invalid domain!" };

            validateDomainFormat(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(statusCalled).toBe(400);
            expect(sendCalled).toBe("Invalid domain format: invalid domain!");
            expect(nextCalled).toBe(false);
        });

        it("should return 400 with spaces in domain", () => {
            mockReq.body = { domain: "example .com" };

            validateDomainFormat(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(statusCalled).toBe(400);
            expect(nextCalled).toBe(false);
        });
    });

    describe("validateBulkDomainsFormat", () => {
        it("should pass validation with valid domains array", () => {
            mockReq.body = { domains: ["example.com", "test.com"] };

            validateBulkDomainsFormat(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(nextCalled).toBe(true);
            expect(statusCalled).toBeNull();
        });

        it("should pass validation with single domain string", () => {
            mockReq.body = { domains: "example.com" };

            validateBulkDomainsFormat(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(nextCalled).toBe(true);
        });

        it("should return 400 when domains is missing", () => {
            mockReq.body = {};

            validateBulkDomainsFormat(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(statusCalled).toBe(400);
            expect(sendCalled).toBe("No domains provided for validation");
            expect(nextCalled).toBe(false);
        });

        it("should return 400 when one domain is invalid", () => {
            mockReq.body = {
                domains: ["example.com", "invalid domain!", "test.com"]
            };

            validateBulkDomainsFormat(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(statusCalled).toBe(400);
            expect(sendCalled).toBe("Invalid domain format: invalid domain!");
            expect(nextCalled).toBe(false);
        });
    });

    describe("asyncHandler", () => {
        it("should call the handler function", async () => {
            let handlerCalled = false;
            let handlerArgs: any[] = [];

            const handler = async (
                req: Request,
                res: Response,
                next: NextFunction
            ) => {
                handlerCalled = true;
                handlerArgs = [req, res, next];
            };

            const wrappedHandler = asyncHandler(handler);

            await wrappedHandler(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(handlerCalled).toBe(true);
            expect(handlerArgs).toEqual([mockReq, mockRes, mockNext]);
        });

        it("should handle ClientControllerException", async () => {
            const error = new ClientControllerException("Client error", 404);
            const handler = async () => {
                throw error;
            };

            const wrappedHandler = asyncHandler(handler);

            await wrappedHandler(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(statusCalled).toBe(404);
            expect(sendCalled).toBe("Client error");
        });

        it("should handle DomainControllerException", async () => {
            const error = new DomainControllerException("Domain error", 400);
            const handler = async () => {
                throw error;
            };

            const wrappedHandler = asyncHandler(handler);

            await wrappedHandler(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(statusCalled).toBe(400);
            expect(sendCalled).toBe("Domain error");
        });

        it("should handle SyncControllerException", async () => {
            const error = new SyncControllerException("Sync error", 500);
            const handler = async () => {
                throw error;
            };

            const wrappedHandler = asyncHandler(handler);

            await wrappedHandler(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(statusCalled).toBe(500);
            expect(sendCalled).toBe("Sync error");
        });

        it("should handle generic errors with default 500 status", async () => {
            const originalConsoleError = console.error;
            let consoleErrorCalled = false;
            let consoleErrorArgs: any[] = [];

            console.error = (...args: any[]) => {
                consoleErrorCalled = true;
                consoleErrorArgs = args;
            };

            const error = new Error("Generic error");
            const handler = async () => {
                throw error;
            };

            const wrappedHandler = asyncHandler(handler, "testing");

            await wrappedHandler(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(statusCalled).toBe(500);
            expect(sendCalled).toBe(undefined);
            expect(consoleErrorCalled).toBe(true);
            expect(consoleErrorArgs[0]).toBe("Error testing:");
            expect(consoleErrorArgs[1]).toBe(error);

            console.error = originalConsoleError;
        });

        it("should use custom error context in logs", async () => {
            const originalConsoleError = console.error;
            let consoleErrorArgs: any[] = [];

            console.error = (...args: any[]) => {
                consoleErrorArgs = args;
            };

            const error = new Error("Test error");
            const handler = async () => {
                throw error;
            };

            const wrappedHandler = asyncHandler(handler, "custom context");

            await wrappedHandler(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(consoleErrorArgs[0]).toBe("Error custom context:");
            expect(consoleErrorArgs[1]).toBe(error);

            console.error = originalConsoleError;
        });
    });
});
