const { countries } = require('../models/countries.model');

function getCountryIndex(country) {
    return countries.indexOf(country.toLowerCase());
}

module.exports = {
    getCountryIndex
};
