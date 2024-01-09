const { countries, countriesIndex, getCountryIndex } = require('./countries.model.js');

var users = [[], [], []];
// function callback(res, userid1, userid2) {
//     res.send(userid1 + userid2);
// }
// users = [
//     [
//         {
//             userid: 'albania1',
//             callback: callback
//         },
//         {
//             userid: 'albania2',
//             callback: callback
//         },
//         {
//             userid: 'albania3',
//             callback: callback
//         },
//     ],//Albania
//     [
//         {
//             userid: 'china1',
//             callback: callback
//         },
//         {
//             userid: 'china2',
//             callback: callback
//         }
//     ],//China
//     [
//         {
//             userid: 'denmark1',
//             callback: callback
//         }
//     ],//Denmark
// ]

// [],//Germany
// [],//India
// [],//New Zealand
// [],//Switzerland


// addUser("Dummy1", "Denmark");
// addUser("Dummy2", "Albania");
// addUser("Dummy3", "China");
// console.log(users);
module.exports = {
    users
}