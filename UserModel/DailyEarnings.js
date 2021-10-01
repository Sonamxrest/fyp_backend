const mongoose = require('mongoose')
const daily = mongoose.model('DailyIncome',{

user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
},
Income: {
    type:Number,
    defaule:0
},
Date:{
    type:Date,
    default: Date.now()
}
})
module.exports = daily;