const mongoose = require('mongoose')
const ride = mongoose.model('Rides',{
    Rider:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    Customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    From:{
        type:String,
        default:''
    },
    To:{
        type:String,
        default:''
    },
    Fare:{
        type:Number,
        default:100
    }
})
module.exports = ride