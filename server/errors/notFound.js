function notFound(message) {
    const error = Error(message);
    error.status = 404;
    throw error;
}

module.exports = notFound;
