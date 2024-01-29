const mongoose=require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

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
