const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "hello1234",
    database: "employees_db"
})

function MainChoice(){
    inquirer.prompt([
        {
            type: "list",
            name: "mainChoice",
            message: "What would you like to do?",
            choices: ["Add a new department","View your departments","Add a new employee role","View employee roles","Add an employee","View current employees","Update an employee's role","Quit"]
        }
    ]).then(data =>{
        switch(data.mainChoice)
        {
            case "Add a new department":
                break;
            case "View your departments":
                break;
            case "Add a new employee role":
                break;
            case "View employee roles":
                break;
            case "Add an employee":
                break;
            case "View your employees":
                break;
            case "Update an employee's role":
                break;
            case "Quit":
                connection.end();
                break;
        }   
    })
}
MainChoice();