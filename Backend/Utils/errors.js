class CustomError extends Error {
    constructor(message){
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFoundError extends CustomError {
    constructor(message = 'Resource not found'){
        super(message);
        this.statusCode = 404;
    }
}

class BadRequestError extends CustomError {
    constructor(message = 'Bad request'){
        super(message);
        this.statusCode = 400;
    }
}

class UnauthorizedError extends CustomError {
    constructor(message = 'Unauthorized access'){
        super(message);
        this.statusCode = 401;
    }
}

class ForbiddenError extends CustomError {
    constructor(message = 'Forbidden access'){
        super(message);
        this.statusCode = 403;
    }
}

class InternalServerError extends CustomError {
    constructor(message = 'Internal server error'){
        super(message);
        this.statusCode = 500;
    }
}

module.exports = {
    CustomError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    InternalServerError
};