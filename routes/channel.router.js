const express = require("express");
const { addUser } = require("../controllers/usersController");

const channelRouter = express.Router();

channelRouter.get("/", (req, res)=>{
    res.json({ message: "Channel Route is working fine" });
});

channelRouter.get("/getchannelname/:userid/:gender/:country", (req, res)=>{
    const { userid, country } = req.params;
    addUser(res, userid, country);
});

module.exports = channelRouter;
