require("dotenv").config();
const router = require('./routes/router')
var cors = require('cors')
const bodyParser = require('body-parser');
const express = require('express')
const swaggerSpec = require("./utils/swagger.js");
const swaggerUi = require('swagger-ui-express');

const port = process.env.APP_PORT || 3000;
const app = express()


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

// swagger configs
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, { explorer: true })
);

// documentation redirect page
app.get("/", function (req, res) {
    res.send(`<center><h2>Welcome Node.js, Express with AWS cognito <br> <a href='http://localhost:${port}/api-docs'>Go to Swagger UI </a></h2></center>`);
})

// API routes
app.use('/api', router);

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// cors config
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Origin, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, Access-Control-Allow-Headers, X-Requested-With, Access-Control-Allow-Origin");
    next();
});
//app.use(express.cors());
/* app.use(cors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
})); */


app.use(errorLogger)
app.use(invalidPathHandler)
app.use(handleError);



module.exports = { app, port};