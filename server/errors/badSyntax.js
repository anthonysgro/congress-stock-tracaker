function badSyntax(message) {
    const error = Error(message);
    error.status = 400;
    throw error;
}

module.exports = badSyntax;
