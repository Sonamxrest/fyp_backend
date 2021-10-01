const express = require("express");
const User = require("../UserModel/registrationModule");
const bcryptjs = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const upload = require('../middleware/multipart')
const {verifyUser} = require("../middleware/authentication");
const Transaction = require('../UserModel/transaction')
const router = express.Router();

router.post("/userLogin", function (req, res) {
  console.log("here we are inside login");
  const PhoneNumber = req.body.PhoneNumber;
  const Password = req.body.Password;

  const hash = bcryptjs.hash(Password, 10).then(function (password) {
    console.log(password);
  });

  // console.log(PhoneNumber, Password);

  User.findOne({ PhoneNumber: PhoneNumber }).then(function (detail) {
    console.log(detail);
    if (detail === null) {
      console.log("incorrect credential");
      return res.status(201).json({ success: false });
    } else {
      bcryptjs.compare(Password, detail.Password, function (err, result) {
        console.log("result", result);
        console.log(err);
        if (result === false) {
          console.log("incorrect password");
          return res.status(201).json({ success: false });
        }

        const token = jwt.sign({ _id: detail._id }, "secretkey");
        res.status(200).json({ token: token, success: true, data: detail });
      });
    }
  });
});

router.post(
  "/userRegister",
  [
    check("FullName", "Team Name required!").not().isEmpty(),
    check("PhoneNumber", "Phone Number Required").not().isEmpty(),
    check("DateOfBirth", "Required Date of Birth").not().isEmpty(),
    check("Password", "Password Required !").not().isEmpty(),
    check("UserType", "UserType Required!").not().isEmpty(),
  ],

  function (req, res) {
      const FullName = req.body.FullName;
      const PhoneNumber = req.body.PhoneNumber;
      const DateOfBirth = req.body.DateOfBirth;
      const Password = req.body.Password;
      const UserType = req.body.UserType;
      console.log(Password);
      console.log(FullName);

      bcryptjs.hash(Password, 10, function (err, hash) {
        const user_data = User({
          FullName: FullName,
          PhoneNumber: PhoneNumber,
          DateOfBirth: DateOfBirth,
          Password: hash,
          UserType: UserType,
          Questions:req.body.Questions
        });
        user_data
          .save()
          .then(function (result) {
            return res.status(201).json({ success: true,message:user_data._id });
          })
          .catch(function (err) {
            res.status(500).json({ success: err });
          });
      });
    
  }
);

router.get("/get/:id", async (req, res) => {
  const data = await User.findById({ _id: req.params.id });
  console.log(data);
  return res.status(200).json({ success: true, data: data });
});
router.put('/profile/:id',upload.single('image'),(req,res)=>{
  if(req.file!==null) {
    User.findByIdAndUpdate({_id:req.params.id},{
      Profile:req.file.filename
    }).then((response) =>{
      return res.status(200).json({succe:true,message:'Profile Updated'})
    })
  }
});


router.put('/rate/:id',verifyUser,async(req,res)=>{
  console.log(req.body.Rating)
 const data= await User.findOne({_id:req.params.id,'Rating.user':req.user._id})
      if(data)
  {
  
      User.update({'Rating.user':req.user._id},{
          
             $set:{'Rating.$.rating':parseInt(req.body.Rating),'Rating.$.user':req.user._id}
          
              }).then((datas)=>{
                  User.findById({_id:req.params.id}).then((user)=>{
                      return res.status(200).json({success:true,token:"",user:user})
                  })
              }) 

  }
  else{
      User.findByIdAndUpdate({_id:req.params.id},{
          $push:{Rating:{user:req.user._id,rating:parseInt(req.body.Rating)}}
              }).then((data)=>{
                  User.findById({_id:req.params._id}).then((user)=>{
                      return res.status(200).json({success:true,token:"",user:user})
                  })
              })   
  }           
})  

router.put("/pay/:id", verifyUser,async(req,res)=>{
  console.log("Pay")
  const transaction = req.body.amount;
  const desc = req.body.desc;
  const reciever = await User.findById({_id:req.params.id})
  const sender = await User.findById({_id: req.user._id})
  User.findOneAndUpdate({_id:reciever._id},{
      Cash : (reciever.Cash + parseInt(transaction))
  }).then((dre)=>{
      User.findOneAndUpdate({_id:sender._id},{
          Cash : (reciever.Cash - parseInt(transaction))
      }).then((dd) =>{
          const tran = Transaction({ Sender: sender._id, Reciever: reciever._id, Amount: parseInt(transaction), Description: desc,Product:req.body.product})
          tran.save().then((resss) =>{
              User.findOne({_id:req.user._id}).then((data)=>{
                  return res.status(200).json({success:true,token:"",user:data})
              })
              
          })
      })
  })
})
router.get("/transaction", verifyUser,(req,res)=>{
  Transaction.find({$or:[{'Sender':req.user._id},{'Reciever':req.user._id}]}).populate('Sender').populate("Reciever").populate('Rides').then((data)=>{
      return res.status(200).json({success:true, data:data})
  })

})
module.exports = router;
