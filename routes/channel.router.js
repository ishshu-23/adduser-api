const { users } = require("../models/users.model.js");
const { addUser } = require("../controllers/users.controller.js");

const express = require("express");

const channelRouter = express.Router();

channelRouter.get("/", (req, res)=>{
    res.json(
        {
            message: "Channel Route is working fine"
        }
    );
})

channelRouter.get("/getchannelname/:userid/:gender/:country", (req, res)=>{
    const userid = req.params.userid;
    const country = req.params.country;
    addUser(res, userid, country);
    console.log(users);
})

module.exports = channelRouter;