const mongoose=require("mongoose");
try{
mongoose.connect("mongodb+srv://admin:Yuvi*4159@cluster0.aqgwmvt.mongodb.net/Paytm");
}
catch(e){
    console.log(e);
}

const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    firstName:{
        type:String,
        require:true
    },
    lastName:{
        type:String,
        require:true
    },
    password:{
        type:String ,
        require:true
    },

})
const BankSchema= new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require:true
    },
    balance:{
        type:Number,
        require:true
    }
})
const User = mongoose.model('User', UserSchema);
const Account=mongoose.model('Account',BankSchema);

module.exports={
    User,Account
}
