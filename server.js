const express = require("express");
const { Mutex } = require('async-mutex');

const channelRouter = require("./routes/channel.router");
const { userCountriesIndexes } = require('./models/countries.model.js');
const { users } = require('./models/users.model.js');

const app = express();

app.get("/hello", (req, res) => {
    const jsonResponse = {
        message: "hello from server",
    };
    res.json(jsonResponse);
});
const mutex = new Mutex();
let uid = 753951;
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
app.use("/channel", channelRouter);

setInterval(() => { 
    // console.log(userCountriesIndexes);
    
    if(userCountriesIndexes.length == 1){
        var userCountriesIndexesObj = userCountriesIndexes[0];
        var index = userCountriesIndexesObj.index;
        var quantity = userCountriesIndexesObj.quantity;  
        if(quantity >= 2){
            var user1 = users[index].shift();
            var user2 = users[index].shift();
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
            userCountriesIndexesObj.quantity = userCountriesIndexesObj.quantity - 1;
            userCountriesIndexesObj.quantity = userCountriesIndexesObj.quantity - 1;
            if(userCountriesIndexesObj.quantity === 0){
                userCountriesIndexes.splice(0, 1);
            }
            console.log(userCountriesIndexes);
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
            console.log(userCountriesIndexes);
        }
    }
    
}, 1);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
