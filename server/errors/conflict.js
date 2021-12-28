function conflict(message) {
    const error = Error(message);
    error.status = 409;
    throw error;
}

module.exports = conflict;
