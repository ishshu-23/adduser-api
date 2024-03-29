const express = require("express");
const { Mutex } = require('async-mutex');

const channelRouter = require("./routes/channel.router");
const { userCountriesIndexes } = require('./models/countries.model.js');
const { users } = require('./models/users.model.js');
const { getCountryIndex } = require('./controllers/countryController.js');

const app = express();

app.get("/hello", (req, res) => {
    const jsonResponse = {
        message: "hello from server",
    };
    res.json(jsonResponse);
});
const mutex = new Mutex();
let uid = 0;
app.get("/getuid", async (req, res) => {
    let uidResponse;
    const release = await mutex.acquire();
    try {
        uid++;
        uidResponse = uid;
    } finally {
        release();
    }
    const uidJsonResponse = {
        uid: uidResponse.toString(),
    };
    res.json(uidJsonResponse);
});
app.use("/channel", channelRouter);

app.post("/user/remove/:userId/:country", (req, res) => {
    const { userId, country } = req.params;

    // Get the index of the country
    const countryIndex = getCountryIndex(country);

    // Check if the country index is valid
    if (countryIndex === -1) {
        return res.status(400).json({ message: `Invalid country: ${country}` });
    }

    // Find the user in the users array corresponding to the country index
    const userArray = users[countryIndex];
    const userIndex = userArray.findIndex(user => user.userid === userId);

    // Check if the user exists in the array
    if (userIndex !== -1) {
        // Remove the user from the array
        userArray.splice(userIndex, 1);

        // Update the quantity in userCountriesIndexes
        const countryInfoIdx = userCountriesIndexes.findIndex(entry => entry.index === countryIndex);
        userCountriesIndexes[countryInfoIdx].quantity--;

        // If the quantity becomes zero, remove the entry from userCountriesIndexes
        if (userCountriesIndexes[countryInfoIdx].quantity === 0) {
            userCountriesIndexes.splice(countryInfoIdx, 1);
        }

        // Send a response indicating success
        console.log(`User ${userId} removed successfully from ${country}`);
        console.log("users post deletion: ", users);
        console.log("userCountriesIndexes post deletion: ", userCountriesIndexes);
        return res.status(200).json({ message: `User ${userId} removed successfully from ${country}` });
    }

    // If the user with the specified userId is not found, send a 404 response
    console.log(`User ${userId} not found in ${country}`);
    res.status(404).json({ message: `User ${userId} not found in ${country}` });
});

setInterval(() => { 
    // console.log(userCountriesIndexes);
    if(userCountriesIndexes.length == 1){
        var userCountriesIndexesObj = userCountriesIndexes[0];
        var index = userCountriesIndexesObj.index;
        var quantity = userCountriesIndexesObj.quantity;  
        if(quantity >= 2){
            var users_arr = users[index];
            var i1 = Math.floor(Math.random() * users_arr.length);
            var i2 = Math.floor(Math.random() * users_arr.length);
            
            if(i1 == i2 || users_arr[i1].userid == users_arr[i2].userid){
            }else{
                // console.log("users_arr: ", users_arr);
                var user1 = users_arr.splice(i1, 1)[0];
                var user2 = users_arr.splice(i2-1, 1)[0];
                var channelname = {
                    userid1: user1.userid,
                    userid2: user2.userid
                };
                console.log("channelname: ", channelname);
                console.log("user1: ", user1);
                console.log("user2: ", user2);
                console.log("Same Country User1 id", user1.userid, "index1: ", index);
                console.log("Same Country User2 id", user2.userid, "index2: ", index);

                user1.res.json(channelname);
                user2.res.json(channelname);

                userCountriesIndexesObj.quantity = userCountriesIndexesObj.quantity - 1;
                userCountriesIndexesObj.quantity = userCountriesIndexesObj.quantity - 1;
                if(userCountriesIndexesObj.quantity === 0){
                    userCountriesIndexes.splice(0, 1);
                }
                console.log("users: ", users);
                console.log(userCountriesIndexes);
                // console.log("users length ", users.length);
            }    
        }
    }else{
        var i1 = Math.floor(Math.random() * userCountriesIndexes.length);
        var i2 = Math.floor(Math.random() * userCountriesIndexes.length);
        

        if (i1 === i2 || userCountriesIndexes[i1].length === 0 || userCountriesIndexes[i2].length === 0) {
        } else {

            var obj1 = userCountriesIndexes[i1];
            var obj2 = userCountriesIndexes[i2];
        
            var index1 = obj1.index;
            var index2 = obj2.index;

            // console.log(obj1, " ", obj2);

            var user1 = users[index1].shift();
            var user2 = users[index2].shift();
        
            var userid1 = user1.userid;
            var userid2 = user2.userid;
            var channelname = {
                userid1: userid1,
                userid2: userid2
            }
            console.log("Different Country User1 id", userid1, "index1: ", index1);
            console.log("Different Country User2 id", userid2, "index2: ", index2);
            user1.res.json(channelname);
            user2.res.json(channelname);
            obj1.quantity = obj1.quantity - 1;
            obj2.quantity = obj2.quantity - 1;
            if(obj1.quantity === 0){
                userCountriesIndexes.splice(i1, 1);
            }
            if(obj2.quantity === 0){
                var inx = userCountriesIndexes.indexOf(obj2);
                userCountriesIndexes.splice(inx, 1);
            }
            console.log("users: ", users);
            console.log(userCountriesIndexes);
        }
    }    
    
}, 100);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
