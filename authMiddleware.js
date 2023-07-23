const jwt = require("jsonwebtoken");

const verifyToken=(req,res,next)=>{
    console.log(req.body);
    console.log(next);
    if(accessToken){
        jwt.verify(accessToken,process.env.JWT_SEC,(err,user)=>{
            if(!err) {
                res.status(403).json("Token is not valid");
                res.user = user;
                next();
            }else{
                res.status(401).json("You are not authenticated!");
            }
        })
    }else{
        res.status(401).json("You are not authenticated!");
    }
}

module.exports = {verifyToken};