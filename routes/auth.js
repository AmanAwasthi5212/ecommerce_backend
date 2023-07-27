const router = require("express").Router();
const User = require("../models/User"); 
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const Cart = require("../models/Cart");

// // delete temp

router.post("/temp",async(req,res)=>{
    console.log(req.body);
    const cart = await Cart.find({userId:req.body.userId});
    console.log(cart);
    res.send(cart);
})

//REGISTER
router.post("/register", async (req, res)=>{
    console.log(req.body);
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASS_SEC
            ).toString(),
    });

    try{
        const savedUser = await newUser.save();
        const cart = new Cart({
            userId:newUser.id,
            products:[],
            total:0,
        });
        await cart.save();
        res.status(201).send(savedUser);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

//LOGIN

router.post("/login", async (req, res)=> {
    // console.log(req.body);
    //     const users = await User.find();
    //     console.log(users);
    //     res.send(users);
    //     return;
    try{
        
        const user = await User.findOne({ username: req.body.username });
        console.log(user);

        if(!user){
            res.status(401).json("Wrong Credentials!");
            return;
        }


        const hashedPassword = CryptoJS.AES.decrypt(
            user.password, 
            process.env.PASS_SEC
            );

        const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        console.log(Originalpassword);

        if(Originalpassword !==req.body.password) {
            res.status(401).json("Wrong Credentials!");
            return;
        }

        const accessToken = jwt.sign({
                    id: user._id,
                    isAdmin: user.isAdmin,
                },
                process.env.JWT_SEC,
                {expiresIn: "3d"}
            );

        const { password, ...others } = user._doc;

        res.status(200).json({...others,accessToken});
        console.log("completed!");

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;