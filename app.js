const express = require('express'); // Express object
const cors = require('cors'); // setup Cross Origin Resource Sharing
const logger = require('morgan'); // monitor http requests in terminal
const bodyParser = require('body-parser'); //grab form request body
const mongoose = require('mongoose'); //mongoose mongodb database models
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

require('dotenv').config(); // parse .env file to get configs

//Connect Database
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify:false
})
.then(
    () => { console.log('MongoDB Connected.!') },
    err => { /** handle initial connection error */ console.log(err) }
);

//Initialize App
const app = express();

//Application Imports

//Import Middlewares
const authMiddleware =  require('./middlewares/auth-middleware');

//Import Routes
const apiRoutes =  require('./routes/api');
const authRoutes =  require('./routes/auth');

//Middlewares
app.use(cors());
app.use(logger('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.get('/',(req,res)=>{
	res.status(200).json({
		message:"Welcome to Express MongoDB JWT Auth App"
	})
});

//Register Routes
app.use('/auth',authRoutes);
app.use('/api',authMiddleware.verifyJWT_MW,apiRoutes);

//catch http error and handle
app.use((req,res,next)=>{
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Express Error handler
app.use((err,req,res,next)=>{
    
    const error = process.env.DEBUG ? err : {};
    const status = err.status || 500;

    //Respond to client
    return res.status(status).json({
        message:error.message
    });

    //Respond to dev
    console.error(err)
})


app.listen(process.env.PORT, () =>{
	console.log("App Listening on "+process.env.PORT)
});
