const router = require("express").Router();

const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/create-payment-intent", async (req, res)=> {
    console.log(req.body.tokenId);
    console.log(process.env.STRIPE_KEY);

    try{
        const paymentIntent = await stripe.paymentIntent.create({
            amount: 2000,
            currency: 'inr',
            automatic_payment_methods: {enabled: true},
        },);
    } catch (err) {
        return res.status(400).send({
            error: {
                message: err.message,
            },
        });
    }
    



    stripe.charges.create(
        {
            source: req.body.tokenId,
            amount: req.body.amount,
            currency: "usd",
        },
        (stripeErr, stripeRes) => {
            if(stripeErr) {
                console.log(stripeErr);
                res.status(500).json(stripeErr);
            } else {
                res.status(200).json(stripeRes);
            }
        }
    )
})


module.exports = router;