const express = require("express");
const app = express();

var http = require("http").createServer(
    {
        requestCert: false,
        rejectUnauthorized: false,
    },
    app
);
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectDB } = require("./config/db");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

app.get("/", (req, res) => {
    res.send("Hello World!");
});

require("./socket/main").default(http);

const { setSessionToken } = require("./config/questions");
setSessionToken().then();

connectDB()
    .then((res) => {
        http.listen(8080, () => {
            console.log(`* Server is running on port: 8080`);
        });
    })
    .catch((rej) => {
        console.log(rej);
    });
