const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { 
    verifyTokenAndAuthorization, 
    verifyTokenAndAdmin,
    verifyTokenFromReact,
    } = require("./VerifyToken");

const cartController = require("../controller/cart");

const {verifyToken} = require("../authMiddleware");

const router = require("express").Router();
 
//CREATE

router.post("/",verifyTokenFromReact, async (req, res) => {
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// add product to cart
router.post("/addToCart",verifyTokenFromReact,async(req,res)=>{
    const cart = await Cart.findOne({userId: res.user.id});
    const product = await Product.findById(req.body.productId);
    let added;

    for(let i=0;i<cart.products.length;i++){
        if(cart.products[i].productId == req.body.productId) {
            cart.products[i].quantity+=1;
            added = true;
            break;
        }
    }
    if(!added)
    cart.products.push({
        productId: req.body.productId,
        quantity: req.body.quantity,
    });

    cart.total += (product.price-0);
    await cart.save();
    res.send(cart);

});

// remvoe product from cart
router.post("/removeFromCart",verifyTokenFromReact,async(req,res)=>{
    const cart = await cart.findOne({userId:res.user.id});

    const newProducts = [];
    let unwanted;
    for(let i=0;i<cart.products.length;i++){
        if(cart.products[i].productId != req.body.productId) 
            newProducts.push(cart.products[i]);
        else unwanted = cart.products[i];
    }

    const product = await product.findById(unwanted.productId);
    cart.products = newProducts;

    if(unwanted)
    cart.total -= product.price * unwanted.quantity;

    await cart.save();

    res.send(cart);
});

// update quantity
router.post("/changeCartQuantity",verifyTokenFromReact,async(req,res)=>{
    const cart = await Cart.findOne({userId:res.user.id});
    const product = await Product.findById(req.body.productId);
    let remove ;
    let unwanted;

    for(let i=0;i<cart.products.length;i++){
        if(cart.products[i].productId == req.body.productId){
            cart.products[i].quantity += req.body.change;
            if(cart.products[i].quantity == 0){
                remove = true;
                unwanted = cart.products[i].productId;
            }
            break;
        }
    }

    if(remove){
        const newProducts = [];
        for(let i=0;i<cart.products.length;i++){
            if(cart.products[i].productId != unwanted) 
                newProducts.push(cart.products[i]);
        }
        cart.products = newProducts;
    }


    cart.total += (req.body.change * product.price);
    console.log(cart.total);
    await cart.save();

    for(let i=0;i<cart.products.length;i++){
        const id = cart.products[i].productId;
        const product = await Product.findById(id);
        cart.products[i].productId = product;
    }
    res.send(cart);
});

//UPDATE
 
router.put("/:id", verifyTokenAndAuthorization, async (req,res)=>{

   try{
    const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
        $set: req.body
    },
    {new:true}
    );
    res.status(200).json(updatedCart);
   } catch(err){
    res.status(500).json(err);
   }

});

//DELETE

router.delete("/:id", verifyTokenAndAuthorization, async (req,res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has been deleted....")
    } catch(err){
        res.status(500).json(err)
    }
});

//GET USER CART

router.post("/find",cartController.findCart);

//GET ALL

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;