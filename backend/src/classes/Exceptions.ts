// exceptions.ts

export class ClientControllerException extends Error {
    status: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = this.constructor.name;
        this.status = status ?? 400;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class DomainControllerException extends Error {
    status: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = this.constructor.name;
        this.status = status ?? 400;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class QueryControllerException extends Error {
    status: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = this.constructor.name;
        this.status = status ?? 400;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class SyncControllerException extends Error {
    status: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = this.constructor.name;
        this.status = status ?? 400;
        Error.captureStackTrace(this, this.constructor);
    }
}
