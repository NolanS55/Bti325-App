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
    service.getDepartments().then((data) => {res.render('addEmployee', {departments : data})}).catch(() => {res.render('addEmployee', {departments : []})});
});

app.get("/employees/delete/:empNum", (req, res) => {
    service.deleteEmployeeByNum(req.params.empNum).then(() => {res.redirect("/employees")}).catch(() => res.status(500).send("Unable to remove employee"))
})

app.get("/employees/:status?/:department?/:manager?", (req, res) => {
    if(req.query.status != null) {
        service.getEmployeesByStatus(req.query.status).then((data) => { if(data.length > 0) {res.render('employees', {employees : data})} else{res.render('employees', {message : "no results"})}}).catch((err) => {res.render('employees', {message : err})})
    }
    else if (req.query.department != null) {
        service.getEmployeesByDepartment(req.query.department).then((data) => {if(data.length > 0) {res.render('employees', {employees : data})} else{res.render('employees', {message : "no results"})}}).catch((err) => {res.render('employees', {message : err})})
    }
    else if (req.query.manager != null) {
        service.getEmployeesByManager(req.query.manager).then((data) => {if(data.length > 0) {res.render('employees', {employees : data})} else{res.render('employees', {message : "no results"})}}).catch((err) => {res.render('employees', {message : err})})
    }
    else {
        service.getAllEmployees().then((data) => {if(data.length > 0) {res.render('employees', {employees : data})} else{res.render('employees', {message : "no results"})}}).catch((err) => {res.render('employees', {message : err})})
    }
    
});

app.get("/employee/:empNum", (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    service.getEmployeesByNum(req.params.empNum).then((data) => {
    if (data) {
        viewData.employee = data; //store employee data in the "viewData" object as "employee"
    } 
    else {
        viewData.employee = null; // set employee to null if none were returned
    }
    }).catch(() => { 
        viewData.employee = null; // set employee to null if there was an error
    }).then(service.getDepartments)
    .then((data) => {viewData.departments = data; // store department data in the "viewData" object as "departments"
    // loop through viewData.departments and once we have found the departmentId that matches
    // the employee's "department" value, add a "selected" property to the matching
    // viewData.departments object
    for (let i = 0; i < viewData.departments.length; i++) {
        if (viewData.departments[i].departmentId == viewData.employee.department) {
            viewData.departments[i].selected = true;
        }
    }
    }).catch(() => { viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
    if (viewData.employee == null) { // if no employee - return an error
        res.status(404).send("Employee Not Found");
    } 
    else {
        res.render("employee", { viewData: viewData }); // render the "employee" view
    }
    });
});

app.get("/departments", (req, res) => {
    service.getDepartments().then((data) => {if(data.length > 0) {res.render('departments', {departments : data})} else{res.render('departments', {message : "no results"})}}).catch((err) => {res.render('departments', {message : err})})
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

app.post("/departments/update", (req, res) => {
    service.updateDepartment(req.body);
    res.redirect("/departments");
})

app.get("/departments/add", (req, res) => {
    res.render('addDepartment');
})

app.post("/departments/add", (req, res) => {
    service.addDepartment(req.body)
    res.redirect("/departments")
})



app.get("/departments/:departmentId", (req, res) => {
    service.getDepartmentById(req.params.departmentId).then((data) => res.render("department", { department : data })).catch((err) => {res.status(404).send("Department Not Found");})
})



// setup http server to listen on HTTP_PORT, PUT NOTHING BELOW THIS
app.use((req, res, next) => {
    res.status(404).send("Page Not Found")
})

service.initialize().then(() => {app.listen(HTTP_PORT, onHttpStart)}).catch(() => {console.log("Error Starting Server")})