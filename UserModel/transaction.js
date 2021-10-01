const mongoose = require('mongoose')


const transaction = mongoose.model('Transaction',{


Sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
},
Reciever:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
},
Rides:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Rides"
},
Date:{
    type:Date,
    default: Date.now()
},
Amount:{
    type:Number
},
Description:{
    type:String
}





})
module.exports = transaction