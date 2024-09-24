const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Router } = require("express");
const User = require("../models/userModel");
require('dotenv').config();

const userRouter = Router();

userRouter.post("/register", async(req, res) => {
    const {username, email, password} = req.body;
    console.log(username, email, password)
    try{
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({message: "User is already registered"});
        }
        user = new User({username, email, password});

        // hash password before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    }
    catch(err){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

userRouter.post("/login", async (req, res) => {
  const {email, password} = req.body;

  try{
    const user = await User.findOne({email});

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({message: "Invalid Credentials"});
    }

    const payload = {user: {id: user.id}};

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1hr",
    });
    res.status(200).json({token});

  }
  catch(err){
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = userRouter;
