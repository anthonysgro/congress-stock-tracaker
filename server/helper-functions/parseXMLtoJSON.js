const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");

module.exports = parseXMLtoJSON = (xmlData) => {
    const parser = new XMLParser();
    const jsonObj = parser.parse(xmlData);

    return jsonObj;
};
