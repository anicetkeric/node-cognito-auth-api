const swaggerJsdoc = require('swagger-jsdoc');


const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "AWS cognito auth-server",
            version: "0.1.0",
            description:
                "AWS cognito auth server with AWS SDK for JavaScript (v3)",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "BootLabs",
                url: "https://github.com/anicetkeric/node-cognito-auth-api#readme",
                email: "info@email.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3080",
            },
        ],
    },
    apis: ["./routes/*.js"],
};


module.exports = swaggerJsdoc(options);