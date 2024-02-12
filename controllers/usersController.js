const { users } = require('../models/users.model.js');
const { userCountriesIndexes } = require('../models/countries.model.js');
const { getCountryIndex } = require('./countryController.js');

function addUser(res, userid, country) {
    const index = getCountryIndex(country);
    let found = false;

    for (const userIndex of userCountriesIndexes) {
        if (userIndex.index === index) {
            userIndex.quantity++;
            found = true;
            break;
        }
    }

    if (!found) {
        userCountriesIndexes.push({ index, quantity: 1 });
    }

    users[index].push({ userid, res });
    console.log("UserCountriesIndexes: ", userCountriesIndexes);
    console.log("users: ", users);
}

module.exports = {
    addUser
};
