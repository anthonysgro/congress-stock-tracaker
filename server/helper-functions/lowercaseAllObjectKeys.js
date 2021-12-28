const lowercaseFirstLetter = require("./lowercaseFirstLetter");

module.exports = lowercaseAllObjectKeys = (obj) => {
    if (typeof obj !== "object") return obj;

    for (const [oldKey, val] of Object.entries(obj)) {
        const newKey = lowercaseFirstLetter(oldKey);

        if (oldKey !== newKey) {
            obj[newKey] = obj[oldKey];
            delete obj[oldKey];
        }

        lowercaseAllObjectKeys(obj[newKey]);
    }

    return obj;
};
