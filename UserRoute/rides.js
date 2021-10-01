const { verifyUser } = require('../middleware/authentication')
const ride = require('../UserModel/Rides')
const Rides = require('../UserModel/Rides')
const routes = require('express').Router()


routes.post('/newRide/:id',verifyUser,(req,res)=>{
const rides = Rides({
    Rider: req.user._id,
    Customer:req.params._id,
    From:req.body.from,
    To:req.body.to,
    Fare:req.body.amount
})
rides.save().then((data)=>{
    return res.status(200).json({success:true,message:rides._id})
})
})
routes.delete('/delete/:id',(req,res)=>{
    Rides.findByIdAndDelete({_id:req.params.id}).then((response)=>{
        return res.status(200).json({success:true,message:'Deleted'})
    })
})
routes.get('/getRides',verifyUser,async(req,res)=>{
    const rider = req.body.rider
    if(rider === true) {
        const rides = Rides.find({Rider:req.user._id})
        return res.status(200).json({success:true,data:rides})
    } else{
        const rides = Rides.find({Customer:req.user._id})
        return res.status(200).json({success:true,data:rides})
    }    
})


module.exports = routes