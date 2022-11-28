const Sequelize = require('sequelize');
var sequelize = new Sequelize('qjwuuozk', 'qjwuuozk', 'Ukgsj9vi1SIEBFLzk131-tQ7hjho7FgY', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: true
   },
   query:{raw: true} // update here. You need it.
});

sequelize.authenticate().then(()=> console.log('Connection success.'))
.catch((err)=>console.log("Unable to connect to DB.", err));
   
let Employee = sequelize.define('Employee', {
    employeeNum:  {
        type: Sequelize.INTEGER ,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING,
  });
  
let Departments = sequelize.define('Departments', {
    departmentID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    departmentName: Sequelize.STRING,
});


module.exports. initialize = function () {
    return new Promise((resolve, reject)=> {
        sequelize.sync().then(resolve()).catch(reject(("unable to sync the database")))
    })
}

module.exports. getAllEmployees = function () {
    return new Promise((resolve, reject)=> {
        if( Employee.findAll()) {
            data = Employee.findAll()
            resolve(data)
        }
        else {
            reject("No employees")
        }
    })
}

module.exports. getDepartments = function () {
    return new Promise((resolve, reject)=> {
        if(Departments.findAll()) {
            data = Departments.findAll()
            resolve(data)
        }
        else {
            reject("Could not load")
        }
    })
}

module.exports. addEmployee = function (employeeData) {
    return new Promise((resolve, reject)=> {
        employeeData.isManager = (employeeData.isManager) ? true : false
        for(const property in employeeData) {
            if(employeeData[property] == "") {
                employeeData[property] = null;
            }
        }
        Employee.create(employeeData).then(resolve()).catch(reject("unable to create employee"))
    })
}

module.exports. updateEmployee = function(employeeData) {
    return new Promise((resolve, reject)=> {
        employeeData.isManager = (employeeData.isManager) ? true : false
        for(const property in employeeData) {
            if(employeeData[property] == "") {
                employeeData[property] = null;
            }
        }
        Employee.update(employeeData, {where: { employeeNum:employeeData.employeeNum}}).then(resolve()).catch(reject("Could Not be added"))
    })
}

module.exports. updateDepartment = function(departmentData) {
    return new Promise((resolve, reject) => {
        for(const property in departmentData) {
            if(departmentData[property] == "") {
                departmentData[property] = null;
            }
        }
        Departments.update(departmentData, {where: { departmentID:  departmentData.departmentID}}).then(resolve()).catch(reject("Could Not be added"))
    })
}

module.exports. getEmployeesByStatus = function (Estatus) {
    return new Promise((resolve, reject)=> {
        if(Employee.findAll({where: { status : Estatus}})) {
           data = Employee.findAll({where: { status: Estatus}})
           resolve(data)
        }
        else {
            reject("No results found")
        }
    })
}

module.exports. getEmployeesByDepartment = function (Edepartment) {
    return new Promise((resolve, reject)=> {
        if(Employee.findAll({where: {department  : Edepartment}})) {
            data = Employee.findAll({where: {department : Edepartment}})
            resolve(data)
        }
        else {
            reject("No results found")
        }
    })
}

module.exports. getEmployeesByManager = function (Emanager) {
    return new Promise((resolve, reject)=> {
        if(Employee.findAll({where: {employeeManagerNum : Emanager}})) {
            data = Employee.findAll({where: {employeeManagerNum : Emanager}})
            resolve(data)
        }
        else {
            reject("No results found")
        }
    })
}

module.exports. deleteEmployeeByNum = function(empNum) {
    return new Promise((resolve, reject) => {
        Employee.destroy({where: {employeeNum: empNum}}).then(resolve()).catch(reject())
    })
}

module.exports. getEmployeesByNum = function (num) {
    return new Promise((resolve, reject)=> {
        if(Employee.findAll({where: {employeeNum : num}})) {
            data = Employee.findAll({where: {employeeNum : num}})
            resolve(data)
        }
        else {
            reject("No results returned")
        }
    })
}

module.exports. addDepartment = function(departmentData) {
    return new Promise((resolve, reject) => {
        for(const property in departmentData) {
            if(departmentData[property] == "") {
                departmentData[property] = null;
            }
        }
        Departments.create(departmentData).then(() => {resolve()}).catch(() => {reject("unable to create department")})
    })
}

module.exports. getDepartmentById = function(id) {
    return new Promise((resolve, reject) => {
        if(Departments.findAll({where: {departmentID : id}})) {
            data = Departments.findAll({where: {departmentID : id}})
            resolve(data)
        }
        reject("No results returned")  
    })
}





