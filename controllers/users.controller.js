const { users } = require('../models/users.model.js');
const { userCountriesIndexes } = require('../models/countries.model.js');
const { getCountryIndex } = require('../controllers/country.controller.js');
function addUser(res, userid, country) {
    var index = getCountryIndex(country);
    check = true;
    for (let i = 0; i < userCountriesIndexes.length; i++) {
        if(userCountriesIndexes[i].index === index){
            userCountriesIndexes[i].quantity = userCountriesIndexes[i].quantity + 1;
            check = false;
            break;
        }
    }
    if(check){
        var obj = {
            index: index,
            quantity: 1
        }
        userCountriesIndexes.push(obj);
    }
    console.log(userCountriesIndexes);
    
    users[index].push({
        userid: userid,
        res: res
    })
}

module.exports = {
    addUser
}
