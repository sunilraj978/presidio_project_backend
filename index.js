const express = require('express');
const { PORT , mongoDBURL } = require('./config');
const bodyParser = require('body-parser');
 const router = require('./routes')
const cors = require('cors');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cors({
    origin : ["https://presidio-project-frontend-git-main-sunil-rajs-projects-065befb7.vercel.app"],
    methods:["POST","GET","PUT","DELETE"],
    credentials:true
}));
app.use(express.json({limit: '50mb'}));

const mongoose = require('mongoose');

app.get("/" , (req,res)=>{
    res.send("Welcome to the API");
})
app.use(router);




async function connectToDatabase() {
    try {
        await mongoose.connect(mongoDBURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

connectToDatabase();



app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
})


