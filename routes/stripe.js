const router = require("express").Router();

const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/create-payment-intent", async (req, res)=> {
    try{
        console.log(req.body);
        const paymentIntent = await stripe.paymentIntents.create({
            currency : "inr",
            amount:req.body.price*100,
            automatic_payment_methods:{
                enabled:true,
            }
        });
        res.send({clientSecret: paymentIntent.client_secret});
    }catch(error){
        return res.status(400).send({
            error:{
                message:error.message,
            }
        })
    }
});

 
module.exports = router;