const jwt = require('jsonwebtoken')
const User = require('../UserModel/registrationModule')



module.exports.verifyUser =(req,res,next)=>{

try{
    const rawToken = req.headers.authorization.split(" ")[1]
    const data = jwt.verify(rawToken,"secretkey")
    User.findById({_id:data._id}).then((r)=>{
        req.user =r
        
        next()
    })
}
catch{

}
  
}


