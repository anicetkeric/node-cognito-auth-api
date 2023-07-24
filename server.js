const http = require("http");
const { app, port} = require("./app");
const server = http.createServer(app);


server.listen(port, () => {
    console.log(`Server is running on the port ${port}.`);
});
