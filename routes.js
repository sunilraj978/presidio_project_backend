const express = require('express');
const router = express.Router();
const Buyer = require('./models/buyerSchema');
const Product = require('./models/productSchema');
const path = require('path');
const bcrypt = require('bcrypt');
const middleware = require('./middleware');
var nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const secretKey ='akdaknafjeofhefijeofjnweofj9r840823348n2r2';




router.get("/" , (req,res)=>{
    res.send("Welcome to the API");
})


// Register buyer..

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber } = req.body;
        if (!firstName || !lastName || !email || !password || !phoneNumber) {
            return res.status(400).json({ "message": "Enter all details" });
        }
        const encryptedPassword = await bcrypt.hash(password, 12); // Hash the password
        const newbuyer = new Buyer({
            firstName: firstName,
            lastName: lastName,
            email:email,
            password: encryptedPassword,
            phoneNumber:phoneNumber
        });
        const buyer = await newbuyer.save();
        if (buyer) {
            // console.log(buyer);
            res.send(buyer._id);
        } else {
            res.send(buyer);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});






//login byer...
router.post("/loginbuyer" , async(req,res)=>{
    // console.log("login API fetched..");
    const { email,password } = req.body;
    // console.log(email  + " " + password );
    if(!email || !password)
    res.status(400).send("Enter all required fields");
    const buyer = await Buyer.findOne({email:email});
    // console.log(buyer);
    if(!buyer){
        return res.status(402).send(false);
    }
    const doMatch = await bcrypt.compare(password , buyer.password);
    // console.log(doMatch);
    if(doMatch){
        const token =  jwt.sign({_id : buyer._id} , secretKey , {expiresIn:'1d'});
        console.log(token);
        res.send([buyer._id , token]);
    }
    else{
        res.status(402).send(false);
    }
})



//------------------------------------------------------------------ Create product by sellers.........................
router.post('/createproduct',middleware, async(req,res)=>{
   
    try{
        // console.log("create product API fetched");
        const {imageUrl, userId, price , area , place , bedrooms , bathrooms , nearBy} = req.body;

        const product = new Product({
            imageUrl,
            userId,
            price,
            area,
            place,
            bedrooms,
            bathrooms,
            nearBy
        })
        const storedProduct = await product.save();
        //    console.log(storedProduct);


        if(storedProduct)
        res.status(200).json(storedProduct);
        else
        res.status(400).json({"message" : "Something went wrong!"})
    }
   
    catch(err){
        console.log(err);
    }

})   



//------------------------------------------------------------- ----------------------------------------------------------

router.get('/fetchData' ,async(req,res)=>{
    try
    {
        const data = await Product.find();
        res.send(data);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send("Internal server error");
    }
})

router.post('/fetchfilter' ,async(req,res)=>{
    const {searchtext} = req.body;
    
    try
    {
        const data = await Product.find({place:searchtext});
        // console.log(data)
        res.send(data);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send("Internal server error");
    }
})

router.get('/fetchMyData/:id', async (req, res) => {
    const userId = req.params.id; // Correctly naming the parameter for clarity
    console.log(userId);
    try {
        const data = await Product.find({ userId: userId }); // Using find instead of findById
        if (!data) {
            return res.status(404).send("No data found");
        }
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
});





router.get('/fetchMyproperty/:id', async(req,res)=>{
    const id = req.params.id;
    //console.log(id);
   try {
        const data = await Product.find({ _id: id }); // Using find instead of findById
        if (!data) {
            return res.status(404).send("No data found");
        }
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
})

router.get('/fetchProfileMyproperty/:id', async(req,res)=>{
    const id = req.params.id;
    //console.log(id);
   try {
        const data = await Product.find({ userId: id }); // Using find instead of findById
        if (!data) {
            return res.status(404).send("No data found");
        }
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
})


router.post('/deletepost/:id' , async(req,res)=>{

    try {
        const data = await Product.findByIdAndDelete(req.params.id); // Using find instead of findById
        if (!data) {
            return res.status(404).send("No data found");
        }
        console.log("deleted")
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }

})

router.put('/update/:id' , async(req,res)=>{

    try {
        const data = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Using findByIdAndUpdate to update instead of findByIdAndDelete
        if (!data) {
            return res.status(404).send("No data found");
        }
        console.log(data);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }

})



router.get('/fetchUserDetails/:id', async(req,res)=>{
    const id = req.params.id;
    console.log(req.params.id);
   try {
        const data = await Buyer.find({ _id: id }); // Using find instead of findById
        if (!data) {
            return res.status(404).send("No data found");
        }
        // console.log(data);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error");
    }
})





///-------------------------------------------------------------------  mail function ---------------------------------------------

  router.post("/confirmorder" , async(req,res)=>{
    
    const {user , buyer , property} = req.body;
   console.log(user);
   console.log(buyer);
   console.log(property);
    var sender = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'agrobazaarbill@gmail.com',
            pass:'fiiewxgrbovavmrm'
        }
    });

    // var composemail={
    //     from:'agrobazaarbill@gmail.com',
    //     to: sellermail ,
    //     subject:"Order Confirmation",
    //     text:`Dear Seller, Your order has been confirmed by the Buyer.\n\nPlease proceed with shipping the products.`
    // }
const emails = [
  {
    from:'agrobazaarbill@gmail.com',
    to: user[0]?.email ,
    subject:"A Customer interested in ur rental house!",
    html: `
    <div style="color: #2a2829; background-color: #ddeedf; padding: 10px;">
    <h2 style="color: #2a2829;">Order Placed!!</h2>
    <p>Dear Owner,</p>
    <p>A Interest has been shown by a buyer .</p>
    <p>Please proceed with contacts below.</p>
    <img src="https://res.cloudinary.com/dgtonwmdv/image/upload/v1716709164/images/homerental_logo-removebg-preview_tfbeq2.png" style="width: 100px; height:100px;"/>
    <h3>Customer Details:</h3>
    <ul>
        <li><strong>Customer Name :</strong> ${buyer[0]?.firstName }${buyer[0]?.lastName}</li>
        <li><strong>Customer PhoneNo :</strong> ${buyer[0]?.phoneNumber}</li>
        <li><strong>Email :</strong> ${buyer[0]?.email}</li>
        <li><strong>Property Interested in :</strong></li>
        <li>  <img src=${property[0]?.imageUrl} style="width: 100px; height:100px;"/></li>
        <li><strong>Place :</strong> ${property[0]?.place}</li>
        <li><strong>Area :</strong> ${property[0]?.area}</li>        
    </ul>
</div>
    `
  }
  
];


  emails.forEach(email => {
  sender.sendMail(email, (error, info) => {
    if (error) {
        res.status(401).send("failed");
      console.log('Error occurred:', error.message);
      return;
    }
    console.log('Email sent:', info.response);
    res.status(200).send("success");
  });
});

});
//------------------------------------------------------------------------------------------------------------------

  
// // Create a transporter
// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: 'your_email@gmail.com',
//     pass: 'your_password'
//   }
// });

// // Array of email objects
// const emails = [
//   {
//     to: 'recipient1@example.com',
//     subject: 'Subject 1',
//     text: 'This is the email body for recipient 1'
//   },
//   {
//     to: 'recipient2@example.com',
//     subject: 'Subject 2',
//     text: 'This is the email body for recipient 2'
//   },
//   // Add more email objects as needed
// ];

// // Loop through the array and send each email
// emails.forEach(email => {
//   transporter.sendMail(email, (error, info) => {
//     if (error) {
//       console.log('Error occurred:', error.message);
//       return;
//     }
//     console.log('Email sent:', info.response);
//   });
// });
 





























































module.exports = router;