const express = require('express');
const { Account } = require('../db');
const zod=require("zod");
const { authmiddleware } = require('../middleware');

const router = express.Router();

router.get("/balance",authmiddleware, async (req,res)=>{
    
    const account=await Account.findOne({
        userId:req.userId
    });
    if(!account){
        return res.json({
            msg:"Account Not found"
        })
    }
    res.json({
        balance:account.balance
    }) 
})
router.post("/transfer",async (req,res)=>{
   const session=await mongoose.startSession();
   session.startTransaction();

   const {amount,to}=req.body;
   const {account}=await Account.findOne({
    userId:req.userId
   }).session(session);
  
   if(!account||account.balance<amount){    
    await session.abortTransaction();
    console.log("Insufficient Balance");
    return;
   }   
   
   const toAccount=await Account.findOne({
    userId:to
   })

   if(!toAccount){
    await session.abortTransaction();
    console.log("Recipient is invalid");
    return;
   }

   await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });


})


module.exports = router;