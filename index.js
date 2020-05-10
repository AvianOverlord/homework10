const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "hello1234",
    database: "employees_db"
})

function Init(){

}