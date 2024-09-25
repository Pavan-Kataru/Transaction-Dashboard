const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const productsRoutes = require('./productsRoutes');
//const { getStatistics } = require('./getStatistics');
const statisticsRoutes = require('./statisticsRoutes')
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;


//Middleware
app.use(cors());
app.use(express.json());


//Routes
app.use('/api/products',productsRoutes)
app.use('/api/statisticsByMonth',statisticsRoutes)




mongoose.connect(MONGOURL).then(()=>{
    console.log("Database is connected successfully");
    app.listen(PORT, ()=> {
        console.log(`Server is running on port ${PORT}`)
    })
})
.catch((error)=>  console.log(error));
