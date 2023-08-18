require('dotenv').config();
const express= require("express");
const cors = require("cors");
const Product=require('./models/productModel');
const productsRoute= require('./routes/productsRoute.js');
const userRoute= require('./routes/userRoute');
const ordersRoute = require('./routes/ordersRoute')
const db = require('./db/connection');


const app=express();
app.use(express.json());

app.use(
    cors({
      origin: "*",
    })
  );

//Connecting DB.
db();

app.use('/api/products/',productsRoute);
app.use('/api/users',userRoute);
app.use('/api/orders/',ordersRoute)



app.get("/",(req,res)=>{
    res.send("Server working");
});




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
})
  
