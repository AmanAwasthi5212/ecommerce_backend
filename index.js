const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const mongoose  =require("mongoose");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const paymentRoute = require("./routes/payment");
const cors = require("cors");



app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout",stripeRoute);
app.use("/payment",paymentRoute);

const PORT = process.env.PORT || 5000;

mongoose
.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("DBConnection Successful");
    app.listen(PORT, () => {
        console.log(`Backend server is running on port ${PORT}!`);
    });
})
.catch((err)=>{
    console.log(err);
});