exports.ClientControllerException = class ClientControllerException extends (
    Error
) {
    constructor(message, status) {
        super(message);
        this.name = this.constructor.name;
        this.status = status ?? 400;
        Error.captureStackTrace(this, this.constructor);
    }
};

exports.DomainControllerException = class DomainControllerException extends (
    Error
) {
    constructor(message, status) {
        super(message);
        this.name = this.constructor.name;
        this.status = status ?? 400;
        Error.captureStackTrace(this, this.constructor);
    }
};

exports.LookupControllerException = class LookupControllerException extends (
    Error
) {
    constructor(message, status) {
        super(message);
        this.name = this.constructor.name;
        this.status = status ?? 400;
        Error.captureStackTrace(this, this.constructor);
    }
};
