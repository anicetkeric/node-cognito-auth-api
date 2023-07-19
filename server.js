require("dotenv").config();
const router = require('./routes/router')
var cors = require('cors')
const bodyParser = require('body-parser');
const express = require('express')


const app = express()
const port = process.env.APP_PORT || 3000;
//app.use(express.cors());
/* app.use(cors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
})); */



// Error handling Middleware functions
const errorLogger = (error, request, response, next) => {
    request.requestTime = Date.now() 
    console.log(`error:  ${error.message}`)
    next(error) // calling next middleware
}

const invalidPathHandler = (request, response, next) => {
    response.status(404)
    response.json({ error: 'Resource not found.' }).send();
}
const handleError = (err, req, res, next) => {
    res.header("Content-Type", 'application/json')
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ error: err.message });
    return;
}

app.use('/api', router);


app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Origin, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, Access-Control-Allow-Headers, X-Requested-With, Access-Control-Allow-Origin");
    next();
});


app.use(errorLogger)
app.use(invalidPathHandler)
app.use(handleError);

app.listen(port, () => {
    console.log(`Server is running on the port ${port}.`);
});

module.exports = app;