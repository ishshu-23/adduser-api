const { users } = require('../models/users.model.js');
const { getCountryIndex } = require('../controllers/country.controller.js');
function addUser(res, userid, country) {
    var index = getCountryIndex(country);
    console.log(index);
    users[index].push({
        userid: userid,
        res: res
    })
    console.log(users);
}

module.exports = {
    addUser
}