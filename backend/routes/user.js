// backend/routes/user.js
const express = require('express');
const zod=require("zod");
const jwt=require("jsonwebtoken");

const router = express.Router();
const {User, Account}=require("../db");
const { JWT_SECRET } = require('../config');
const { authmiddleware } = require('../middleware');

const signUpSchema=zod.object({
    username: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})
const signInSchema=zod.object({
    username:zod.string().email(),
    password:zod.string()
})
router.post("/signup",async (req,res,next)=>{
    const username=req.body.username;
    const password=req.body.password;
    const firstName=req.body.firstName;
    const lastName=req.body.lastName; 

    const {success}=signUpSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            msg:"Incorrect Input/Email is already taken"
        })
    }
    const user=User.findOne({
        username:req.body.username
    })
    if(user._id){
        return res.status(411).json({
            msg:"This email is already taken"
        })
    }
    
    try {
        const user=await User.create({username,password,firstName,lastName});
        const userId=user._id;
        const token=jwt.sign({
            userId },JWT_SECRET);

            await Account.create({
                userId,
                balance:1+Math.random()*10000
            })
            
        res.status(200).json({
            msg:"User created successfully",
            token:token
        })   
    }
    catch (e){
        console.log("Error creating user");
    }
})
router.post("/signin",async (req,res,next)=>{
    const username=req.body.username;
    const password=req.body.password;


    const {success}=signInSchema.safeParse(req.body);
    if(!success){
       return res.status(411).json({
            msg:"Incorrect input"
        })
    }
    const user=await User.findOne({
        username:req.body.username,
        password:req.body.password
    })
    if(user){
        const token=jwt.sign({
            userId:user._id
        },JWT_SECRET);

    return res.json({
            msg:"Signed in successfully",
            token:token
        })
    }
    return res.status(411).json({
        msg:"Please check your email or password!"
    })  

})

const updatebody=zod.object({
    password:zod.string().optional(),
    firstName:zod.string().optional(),
    lastName:zod.string().optional()
})

router.put("/",authmiddleware,async (req,res,next)=>{
    const {success}=updatebody.safeParse(req.body);
    if(!success){
        res.status(411).json({
            msg:"Could not update information"
        })
    }
    try{
        const result = await User.updateOne({ _id: req.userId }, {
            $set: req.body
        });
        if (result.nModified === 0) {
            return res.status(404).json({ msg: "User not found or no changes made" });
        }
        res.json({ msg: "Updated Successfully" });
} catch (E){
    res.status(411).json({
        msg:"Could not update information"
    })
}
})

router.get("/bulk",async(req,res)=>{
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})
module.exports = router;;