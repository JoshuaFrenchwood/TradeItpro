const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ProfileSchema = new Schema({

    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },

    handle:{
        type:String,
        max:40
    },

    balance:{ 
        type: Number
    },

    
    stockinfo:[{
            stockname:String,
            stockcount:Number
    }],
    
    

    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = Profile = mongoose.model('profile',ProfileSchema);