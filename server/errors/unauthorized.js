function unauthorized(message) {
    const error = Error(message);
    error.status = 401;
    throw error;
}

module.exports = unauthorized;
