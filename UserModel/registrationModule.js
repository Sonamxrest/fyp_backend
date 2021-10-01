const { Int32 } = require("bson");
const mongoose = require("mongoose");

const User = mongoose.model("User", {
  FullName: { type: String },

  DateOfBirth: { type: String },

  Password: { type: String },

  PhoneNumber: { type: String },

  UserType: {type: String},

  RewardPoint: {type: Number},
  Rating:[{
    user:{
        type:String
    },
    rating:{
        type:Number
    }
}],
  Cash: {type: Number,
  default:10000},
  Profile:{
    type:String,
    default:'no-image.jpg'
  },
  Questions:[{
    question:{
        type:String
    },
    answer:{
        type:String
    }
}]
});

module.exports = User;
