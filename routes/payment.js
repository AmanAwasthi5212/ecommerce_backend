const express = require('express');
const router = express.Router();

const stripe = require("stripe")("sk_test_51NMXCrSFs3phF9GMcyX1CxQufa3xtKoIgZXiaXvHEUk5g3Uh6PHtLL9BwGfiYMRd64toLTEEdeSjiHpDU7rTZyC000JNB9MHoF");

router.post("/create-payment-intent",async(req,res)=>{
    console.log(req.body);

    const paymentIntent = await stripe.paymentIntents.create({
        amount:1000 * 100,
        currency : "inr",
        automatic_payment_methods:{
            enabled: true,
        },
    });

    console.log(paymentIntent.client_secret);
    
    res.send({
        clientSecret:paymentIntent.client_secret,
    });

});

module.exports = router;