const { countries } = require('../models/countries.model.js');
function getCountryIndex(country){
    for (let index = 0; index < countries.length; index++) {
        const element = countries[index];
        if(element == country){
            return index;
        }
    }
}


module.exports = {
    getCountryIndex
}