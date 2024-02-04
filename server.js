const express = require("express");
const { Mutex } = require('async-mutex');

const channelRouter = require("./routes/channel.router");
const { userCountriesIndexes } = require('./models/countries.model.js');
const { users } = require('./models/users.model.js');
const { getCountryIndex } = require('./controllers/country.controller.js');

const app = express();

app.get("/hello", (req, res) => {
    const jsonResponse = {
        message: "hello from server",
    };
    res.json(jsonResponse);
});
const mutex = new Mutex();
let uid = 1;
app.get("/getuid", async (req, res) => {
    let uidResponse;
    const release = await mutex.acquire();
    try {
        uid = uid + 1;
        uidResponse = uid;
        const uidJsonResponse = {
        uid: uidResponse.toString(),
        };
        res.json(uidJsonResponse);
    } finally {
        release();
    }
});

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
        // Send a response indicating success
        // Decrement the quantity in userCountriesIndexes
        const userCountryIndex = userCountriesIndexes.findIndex(entry => entry.index === countryIndex);
        if (userCountryIndex !== -1) {
            userCountriesIndexes[userCountryIndex].quantity--;
            // If quantity becomes 0, remove the object from userCountriesIndexes
            if (userCountriesIndexes[userCountryIndex].quantity === 0) {
                userCountriesIndexes.splice(userCountryIndex, 1);
            }
        }
        // Send a response indicating success
        console.log("users ", users);
        console.log("userCountriesIndexes ", userCountriesIndexes);
        return res.status(200).json({ message: `User ${userId} removed successfully from ${country}` });
    }

    // If the user with the specified userId is not found, send a 404 response
    console.log("userCountriesIndexes ", userCountriesIndexes);
    res.status(404).json({ message: `User ${userId} not found in ${country}` });
});


app.use("/channel", channelRouter);

setInterval(() => { 
    // console.log(userCountriesIndexes);
    
    if(userCountriesIndexes.length == 1){
        var userCountriesIndexesObj = userCountriesIndexes[0];
        var index = userCountriesIndexesObj.index;
        var quantity = userCountriesIndexesObj.quantity;  
        if(quantity >= 2){
            console.log("Users :", users);
            var user1 = users[index].shift();
            var user2 = users[index].shift();
            var userid1 = user1.userid;
            var userid2 = user2.userid;
            if(userid1 != userid2){
                console.log("User1 id", userid1, "index1: ", index1);
                console.log("User2 id", userid2, "index2: ", index2);
                var channelname = {
                    userid1: userid1,
                    userid2: userid2
                }
                user1.res.json(channelname);
                user2.res.json(channelname);
                userCountriesIndexesObj.quantity = userCountriesIndexesObj.quantity - 1;
                userCountriesIndexesObj.quantity = userCountriesIndexesObj.quantity - 1;
                if(userCountriesIndexesObj.quantity === 0){
                    userCountriesIndexes.splice(0, 1);
                }
                console.log("userCountriesIndexes ", userCountriesIndexes);
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
            console.log("User1 id", userid1, "index1: ", index1);
            console.log("User2 id", userid2, "index2: ", index2);
            var channelname = {
                userid1: userid1,
                userid2: userid2
            }
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
            console.log("userCountriesIndexes ", userCountriesIndexes);
        }
    }
    
}, 1);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
