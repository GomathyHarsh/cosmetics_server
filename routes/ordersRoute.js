const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Order = require("../models/orderModel");
const stripe = require("stripe")("sk_test_51NeynqSFSKenJz88e62OLbarFcWxGMi5QAU0dvh6XIDjy7TMlrA09v1cAQSRR4LYM3VmAx4DpPgAsykPJMNcDE4t00nrui51pz")

router.post("/placeorder",async (req,res) =>{
    const {token,subtotal,currentUser,cartItems} =req.body;
    try {
        const customer = await stripe.customers.create({
          email: token.email,
          source: token.id,
        })
        const payment = await stripe.paymentIntents.create({
            amount: subtotal * 100,
            currency: "inr",
            customer: customer.id,
            receipt_email: token.email,
          },{
            idempotencyKey:uuidv4()
          });

          if(payment){
            const newOrder = new Order({
                name: currentUser.name,
                email: currentUser.email,
                userid: currentUser.userid,
                orderItems: cartItems,
                shippingAddress: {
                  street: token.card.address_line1,
                  city: token.card.address_city,
                  country: token.card.address_country,
                  pincode: token.card.address_zip,
                },
                orderAmount: subtotal,
                transactionId: payment.id,//transaction id given by stripe
            })
            const savedOrder= await newOrder.save()

            res.send('Order placed successfully')
          }
          else {
            res.status(400).json({ message: "User ID is missing" });
          }
    }
    catch(error){

        return res.status(400).json({message:'Something went wrong:'+error})
    }


});

router.post("/getuserorders",async (req,res) =>{
  const {userid} = req.body;
  try{
    const orders = await Order.find({userid : userid}).sort({_id:-1}) // to sort orders in date wise
    res.send(orders)
  }
  catch(error){
    return res.status(400).json({message:'Something went wrong'});
  }
})

router.get("/getallorders", async (req, res) => {
  try {
    const orders = await Order.find({});
    res.send(orders);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/deliverorder", async (req, res) => {
  const orderid = req.body.orderid;
  try {
    const order = await Order.findOne({ _id: orderid });
    order.isDelivered = true;
    await order.save();
    res.send("Order Delivered Successfully");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});



module.exports = router;
