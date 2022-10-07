/*************************************************************************
* BTI325– Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy. No part * of this assignment has been copied manually or electronically from any
other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Nolan Smith Student ID: 101664217 Date: OCT 5, 2022
*
* Your app’s URL (from Cyclic) : https://gorgeous-rose-salamander.cyclic.app
*
*************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var service = require('./data-service.js')


function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/home.html');
});

app.get("/about", (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
});

app.get("/employees", (req, res) => {
    service.getAllEmployees().then((data) => {res.send(data)}).catch((err) => res.send({message : err}))
});

app.get("/departments", (req, res) => {
    service.getAllDepartments().then((data) => {res.send(data)}).catch((err) => res.send({message : err}))
});

app.get("/managers", (req, res) => {
    service.getManagers().then((data) => {res.send(data)}).catch((err) => res.send({message : err}))
});

app.use((req, res, next) => {
    res.status(404).send("Page Not Found")
})

// setup http server to listen on HTTP_PORT
service.initialize().then(() => {app.listen(HTTP_PORT, onHttpStart)}).catch(() => {console.log("Error Starting Server")})