const { countries } = require('./countries.model.js');

const users = Array.from({ length: countries.length }, () => []);

module.exports = {
    users
};
