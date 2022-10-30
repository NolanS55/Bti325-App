/*************************************************************************
* BTI325– Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy. No part * of this assignment has been copied manually or electronically from any
other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Nolan Smith Student ID: 101664217 Date: OCT 30, 2022
*
* Your app’s URL (from heroku) : https://mysterious-oasis-45796.herokuapp.com/
*
*************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var service = require('./data-service.js')
var multer = require("multer")
var path = require('path')
var fs = require('fs');
const e = require("express");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

var storage = multer.diskStorage ( {
    destination:  "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    } 
})

var upload = multer({ storage: storage });

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

//employees Routes
app.get("/employees/add", (req, res) => {
    res.sendFile(__dirname + '/views/addEmployee.html');
});

app.get("/employees/:status?/:department?/:manager?", (req, res) => {
    if(req.query.status != null) {
        service.getEmployeesByStatus(req.query.status).then((data) => {res.send(data)}).catch((err) => res.send({message: err}))
    }
    else if (req.query.department != null) {
        service.getEmployeesByDepartment(req.query.department).then((data) => {res.send(data)}).catch((err) => res.send({message: err}))
    }
    else if (req.query.manager != null) {
        service.getEmployeesByManager(req.query.manager).then((data) => {res.send(data)}).catch((err) => res.send({message: err}))
    }
    else {
        service.getAllEmployees().then((data) => {res.send(data)}).catch((err) => res.send({message : err}))
    }
    
});

app.get("/employee/:value", (req,res) => {
    service.getEmployeesByNum(req.params.value).then((data) => {res.send(data)}).catch((err) => res.send({message : err}))
})

app.get("/departments", (req, res) => {
    service.getAllDepartments().then((data) => {res.send(data)}).catch((err) => res.send({message : err}))
});

app.get("/managers", (req, res) => {
    service.getManagers().then((data) => {res.send(data)}).catch((err) => res.send({message : err}))
});

app.get("/images/add", (req, res) => {
    res.sendFile(__dirname + '/views/addImage.html');
});

app.get("/images", (req, res) => {
    fs.readdir(__dirname + '/public/images/uploaded', (err, files) => {
        if (err)
          res.send(err);
        else {
          res.json({images : files})
        }
      })
})

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images")
});

app.post("/employees/add", (req, res) => {
    service.addEmployee(req.body)
    res.redirect("/employees")
})

app.use((req, res, next) => {
    res.status(404).send("Page Not Found")
})

// setup http server to listen on HTTP_PORT
service.initialize().then(() => {app.listen(HTTP_PORT, onHttpStart)}).catch(() => {console.log("Error Starting Server")})