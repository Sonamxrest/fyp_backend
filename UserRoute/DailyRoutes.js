const { verifyUser } = require('../middleware/authentication')
const daily = require('../UserModel/DailyEarnings')
const routes = require('express').Router()

routes.post('/daily',verifyUser,async(req,res) =>{
    const newIncome = parseInt(req.body.income);
let dailyIncome = await daily.fondOne({user:req.user._id,Date:Date.now()});
if(dailyIncome!==null) {
    newIncome += dailyIncome.Income;
    daily.findOneAndUpdate({_id:dailyIncome._id},{Income:newIncome}).then((response) =>{
        return res.status(200).json({success:true, message:'New Income Added'})
    })
} else {
const newInc = daily({
    user: req.user._id,
    Income:newIncome
})
newInc.save().then((response) =>{
    return res.status(200).json({success:true, message:'New Income Added'})
})}})

routes.get('/getDaily',verifyUser,async(req,res)=>{
    const data = await daily.find({user:req.user._id,Date:Date.now()})
    return res.status(200).json({success:true,data:data})
})

module.exports = routes