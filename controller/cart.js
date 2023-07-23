const Cart = require("../models/Cart");
module.exports.findCart = async (req,res)=>{
    try{
        const accessToken = req.body.accessToken;
    if(accessToken){
        jwt.verify(accessToken,process.env.JWT_SEC,async (err,user)=>{
            if(!err) {
                res.status(403).json("Token is not valid");
                res.user = user;
                const cart = await Cart.findOne({userId: res.user.id});

                for(let i=0;i<cart.products.length;i++){
                    const id = cart.products[i].productId;
                    const product = await Product.findById(id);
                    cart.products[i].productId = product;
                }
        
                console.log(cart);
                res.status(200).json(cart);        
            }else{
                res.status(401).json("You are not authenticated!");
            }
        })
    }else{
        res.status(401).json("You are not authenticated!");
    }
    } catch(err){
        res.status(500).json(err)
    }
};