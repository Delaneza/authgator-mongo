class NotFoundException extends Error {
    constructor(message) {
        super(message)
    }
}

class BadRequestException extends Error {
    constructor(message) {
        super(message)
    }
}

module.exports = { NotFoundException, BadRequestException }