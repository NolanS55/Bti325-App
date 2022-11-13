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
var exphbs = require('express-handlebars')
const e = require("express");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function(url, options){
            return '<li' + ((url == app.locals.activeRoute) ? ' class="active" ' : '') + '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
        }
    }
}));
app.set('view engine', '.hbs');

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

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
})

// setup a 'route' to listen on the default url path
app.get("/", (req, res, next) => {
    res.render('home');
});

app.get("/about", (req, res) => {
    res.render('about');
});

//employees Routes
app.get("/employees/add", (req, res) => {
    res.render('addEmployee');
});

app.get("/employees/:status?/:department?/:manager?", (req, res) => {
    if(req.query.status != null) {
        service.getEmployeesByStatus(req.query.status).then((data) => {res.render('employees', {employees : data})}).catch((err) => {res.render('employees', {message : err})})
    }
    else if (req.query.department != null) {
        service.getEmployeesByDepartment(req.query.department).then((data) => {res.render('employees', {employees: data})}).catch((err) => {res.render('employees', {message : err})})
    }
    else if (req.query.manager != null) {
        service.getEmployeesByManager(req.query.manager).then((data) => {res.render('employees', {employees: data})}).catch((err) => {res.render('employees', {message : err})})
    }
    else {
        service.getAllEmployees().then((data) => {res.render('employees', {employees: data})}).catch((err) => {res.render('employees', {message : err})})
    }
    
});

app.get("/employee/:value", (req,res) => {
    service.getEmployeesByNum(req.params.value).then((data) => res.render("employee", { employee: data })).catch((err) => {res.render('employee', {message : "no results"})})
})

app.get("/departments", (req, res) => {
    service.getAllDepartments().then((data) => {res.render('departments', {departments : data})}).catch((err) => {res.render('departments', {message : err})})
});

app.get("/managers", (req, res) => {
    service.getManagers().then((data) => {res.send(data)}).catch((err) => res.send({message : err}))
});
app.get("/images/add", (req, res) => {
    res.render('addImage');
});

app.get("/images", (req, res) => {
    fs.readdir(__dirname + '/public/images/uploaded', (err, files) => {
        if (err)
          res.send(err);
        else {
          res.render('image', {data: files});
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

app.post("/employee/update", (req, res) => {
    service.updateEmployee(req.body);
    res.redirect("/employees");
});

app.use((req, res, next) => {
    res.status(404).send("Page Not Found")
})



// setup http server to listen on HTTP_PORT
service.initialize().then(() => {app.listen(HTTP_PORT, onHttpStart)}).catch(() => {console.log("Error Starting Server")})