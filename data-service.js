var employees = []
var departments = []
var fs = require('fs')
const { resolve } = require('path')

module.exports. initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/employees.json', (err, data)=> {
            if(err) reject('Failed to read employees.json')
            employees = JSON.parse(data)
            
            if(employees.length != 0) {
                fs.readFile('./data/department.json', (err, data)=> {
                    if(err) reject("Failed to read departments.json")
                    departments = JSON.parse(data)
                })
            }
            if(!err) {
                resolve('Files read successfully')
            }
        })
    })
}

module.exports. getAllEmployees = function () {
    return new Promise((resolve, reject)=> {
        if(employees.length === 0) reject("No employees found")
        resolve(employees)
    })
}

module.exports. getManagers = function() {
    return new Promise((resolve, reject) => {
        let managers = [];      
        for(let i = 0; i < employees.length; i++) {
            if(employees[i].isManager) managers.push(employees[i])
        }
        if(managers.length === 0) reject("No Managers found")
        resolve(managers)
    })
}

module.exports. getAllDepartments = function () {
    return new Promise((resolve, reject)=> {
        if(departments.length === 0) reject("No departments found")
        resolve(departments)
    })
}

module.exports. addEmployee = function (employeeData) {
    return new Promise((resolve, reject) => {
        if(employeeData.isManager == null) employeeData.isManager = false
        else employeeData.isManager = true
        employeeData.employeeNum = employees.length + 1
        employees.push(employeeData)
        console.log(employeeData)
        resolve()
    })
}

module.exports. getEmployeesByStatus = function (status) {
    return new Promise((resolve, reject)=> {
        let statuses = []
        for(let i = 0; i < employees.length; i++) {
            if(employees[i].status == status) statuses.push(employees[i])
        }
        if(statuses.length === 0) reject("No Employees found")
        resolve(statuses)
    })
}

module.exports. getEmployeesByDepartment = function (department) {
    return new Promise((resolve, reject)=> {
        let empDepartments = []
        for(let i = 0; i < employees.length; i++) {
            if(employees[i].department == department) empDepartments.push(employees[i])
        }
        if(empDepartments.length === 0) reject("No Employees found")
        resolve(empDepartments)
    })
}

module.exports. getEmployeesByManager = function (manager) {
    return new Promise((resolve, reject)=> {
        let empManagers = []
        for(let i = 0; i < employees.length; i++) {
            if(employees[i].employeeManagerNum == manager) empManagers.push(employees[i])
        }
        if(empManagers.length === 0) reject("No Employees found")
        resolve(empManagers)
    })
}

module.exports. getEmployeesByNum = function (num) {
    return new Promise((resolve, reject)=> {
        let empNum = []
        for(let i = 0; i < employees.length; i++) {
            if(employees[i].employeeNum == num) empNum.push(employees[i])
        }
        if(empNum.length === 0) reject("No Employees found")
        resolve(empNum)
    })
}



