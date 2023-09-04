const express = require('express');
const connectDB = require('./database/Database');
const cors = require('cors');
const cloudinary = require('cloudinary');
const multipart = require('connect-multiparty');
const axios = require('axios');

// Dotenv Config
require("dotenv").config();
const app = express();

// express json
app.use(express.json());
app.use(multipart())

// cors config
const corsOptions = {
    origin: true,
    credentials: true,
    optionSuccessStatus: 200
};

cloudinary.config({
    cloud_name: "kingsly",
    api_key: "368993726257699",
    api_secret: "t7wlk7UbEkBn--lCB4OhDJ-E4_U"
});

app.use(cors(corsOptions));

// set view engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))

//  create a route
app.get('/', (req, res) => {
    res.send('Welcome to API');
});

// middleware for user controller
app.use('/api/user', require('./controllers/userControllers'));
// middleware for product controller
app.use('/api/product', require('./controllers/productController'));
// middleware for order controller
app.use('/api/orders', require('./controllers/orderController'));

app.post('/khalti-api', async (req, res) => {
    const payload = req.body;
    // console.log(payload);
    const khaltiResponse = await axios.post(
        'https://a.khalti.com/api/v2/epayment/initiate/',
        payload,
        {
            headers : {
                Authorization: 'Key a6177cd297f34b7a8dbb69e0cd759c17'
            }
        }
    )
    if (khaltiResponse) {
        res.json({
            success: true,
            data: khaltiResponse?.data,
        })
    } else {
        res.json({
            success: false,
            message: "something went wrong",
        })
    }
    console.log(khaltiResponse);
})


// connect to database
connectDB();

// listen to the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});



