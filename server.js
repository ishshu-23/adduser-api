const express = require("express");
const channelRouter = require("./routes/channel.router");
const { countries } = require('./models/countries.model.js');
const { users } = require('./models/users.model.js');

const app = express();

app.get("/hello", (req, res) => {
    const jsonResponse = {
        message: "hello from server",
    };
    res.json(jsonResponse);
});

app.use("/channel", channelRouter);

setInterval(() => { 
    var index1 = Math.floor(Math.random() * countries.length);
    var index2 = Math.floor(Math.random() * countries.length);
    if (index1 === index2 || users[index1].length === 0 || users[index2].length === 0) {
    } else {
        var user1 = users[index1].shift();
        var userid1 = user1.userid;
        var user2 = users[index2].shift();
        var userid2 = user2.userid;
        console.log("User1 id", userid1, "User2 id", userid2);
        var channelname = {
            userid1: userid1,
            userid2: userid2
        }
        user1.res.json(channelname);
        user2.res.json(channelname);
    }
}, 1000);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));
