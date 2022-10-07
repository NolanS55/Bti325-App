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