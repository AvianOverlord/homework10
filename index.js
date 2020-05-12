const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const fs = require("fs");
const path = require("path");

let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "hello1234",
    database: "employees_db"
})

function Init()
{
    //connection.query(fs.readFileSync(path.join(__dirname,"seed.sql")));
    MainChoice();
}

function MainChoice(){
    inquirer.prompt([
        {
            type: "list",
            name: "MainChoice",
            message: "What would you like to do?",
            choices: ["Add a new department","View your departments","Add a new employee role","View employee roles","Add an employee","View current employees","Update an employee's role","Quit"]
        }
    ]).then(data =>{
        switch(data.MainChoice)
        {
            case "Add a new department":
                AddDepartment();
                break;
            case "View your departments":
                DisplayDepartments();
                break;
            case "Add a new employee role":
                AddRole();
                break;
            case "View employee roles":
                DisplayRoles();
                break;
            case "Add an employee":
                AddEmployee();
                break;
            case "View your employees":
                DisplayEmployees();
                break;
            case "Update an employee's role":
                UpdateEmployee();
                break;
            case "Quit":
                connection.end();
                break;
        }   
    })
}

function UpdateEmployee()
{
    connection.query("SELECT * FROM employees",function(err, employeeRes)
    {
        if(employeeRes.length === 0)
        {
            console.log("You need employees before updating them!");
            MainChoice();
        }
        else
        {
            inquirer.prompt([
                {
                    type: "rawlist",
                    name: "chosenEmployee",
                    message: "Which employee do you want to update?",
                    choices: function() {
                        let choiceArray = [];
                        for (let i =0; i < employeeRes.length; i++)
                        {
                            choiceArray.push(employeeRes[i].last_name);
                        }
                        return choiceArray;
                    }
                }
            ]).then(data => {
                connection.query("SELECT id FROM employees WHERE last_name = ?", data.chosenEmployee, function(err,res){
                    if(err) throw err;
                    employee = {new: false, id: res[0].id};
                    SetEmployeeRole(employee);
                });
            });
        }
    });
}

function DisplayEmployees()
{
    connection.query("SELECT * FROM employees", function(err, results) //Ask about inserting in other files
    {
        if(err) throw err;
        console.table(results);
        MainChoice();
    })
}

function AddDepartment()
{
    inquirer.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "What is the department's name?"
        }
    ]).then(data => {
        connection.query(
            "INSERT INTO departments SET ?",
            {
              departmentName: data.departmentName
            },
            function(err) {
              if (err) throw err;
              console.log("Your department was created successfully!");
              MainChoice();
            }
        );
    });
}

function AddRole()
{
    connection.query("SELECT * FROM departments", function(err, results)
    {
        if(results.length === 0)
        {
            console.log("Establish departments first");
        }
        else
        {
            inquirer.prompt([
                {
                name: "department",
                type: "rawlist",
                choices: function() {
                    let choiceArray = [];
                    for (let i =0; i < results.length; i++)
                    {
                        choiceArray.push(results[i].departmentName); //Ask if if there's a way to add a value or id to these choices
                    }
                    return choiceArray;
                 },
                message: "Which department is this role part of?"
                },
                {
                    type: "input",
                    name: "title",
                    message: "What is this job's title?"
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is this job's salary?"
                }
            ]).then(answers => {
                connection.query(`SELECT id FROM departments WHERE departmentName='${answers.department}'`,function(err,idResult){
                    if(err) throw err;
                    const departmentID = idResult[0].id;
                    console.log("D-ID: " + departmentID);
                    connection.query(
                        "INSERT INTO roles SET ?",
                        {
                          title: answers.title,
                          salary: answers.salary,
                          department_id: departmentID
                        },
                        function(err) {
                          if (err) throw err;
                          console.log("Role added.");
                          MainChoice();
                        }
                      );
                })
            })
        }
    })
}

function DisplayDepartments()
{
    connection.query("SELECT departmentName FROM departments", function(err, results)
    {
        if(err) throw err;
        console.table(results);
        MainChoice();
    }
    )
}

function DisplayRoles()
{
    connection.query("SELECT title, salary FROM roles", function(err, results) //Ask about inserting in other files
    {
        if(err) throw err;
        console.table(results);
        MainChoice();
    })
}

function AddEmployee()
{
    inquirer.prompt([{
        type: "input",
        name: "firstName",
        message: "What is this employee's first name?"
    },
    {
        type: "input",
        name: "lastName",
        message: "What is this employee's last name?"
    }
    ]).then(data =>{
        employee = {first_name: data.firstName, last_name: data.lastName, new: true};
        SetEmployeeRole(employee);
    });
}

function SetEmployeeRole(employee)
{
    connection.query("SELECT title FROM roles",function(err, roleResults){
        inquirer.prompt([{
            type: "rawlist",
            name: "jobTitle",
            message: "What is this employee's job title?",
            choices: function() {
                let choiceArray = [];
                for (let i =0; i < roleResults.length; i++)
                {
                    choiceArray.push(roleResults[i].title); //Ask if if there's a way to add a value or id to these choices
                }
                return choiceArray;
             }
        }
        ]).then(data => {
            connection.query("SELECT id FROM roles WHERE title = ?", data.jobTitle, function(err, roleIDres){
                employee.titleId = roleIDres.id;
                SetEmployeeManager(employee);
            })
        });
    });
}

function SetEmployeeManager(employee)
{
    connection.query("SELECT last_name FROM employees",function(err, managerResults){
        inquirer.prompt([
            {
                type: "rawlist",
                name: "manager",
                message: "Who is this employee's manager?",
                choices: function() {
                    let choiceArray = [];
                    choiceArray.push("No one.");
                    for (let i =0; i < managerResults.length; i++)
                    {
                        choiceArray.push(managerResults[i].last_name); //Ask if if there's a way to add a value or id to these choices
                    }
                    return choiceArray;
                 }
            }
        ]).then(data => {
            if(data.manager !== "No one.")
            {
                connection.query("SELECT id FROM employees WHERE last_name = ?", data.manager,function(err,managerIdRes)
                {
                    employee.manager = managerIdRes[0].id;
                    SetEmployeeData(employee);
                });
            }
            else
            {
                SetEmployeeData(employee);
            }
        });
    });
}

function SetEmployeeData(employee)
{
    if(employee.new && employee.manager)
    {
        const query = connection.query(
            "INSERT INTO employees SET ?",{first_name: employee.firstName, last_name: employee.lastName, role_id: employee.titleId, manager_id: employee.manager},
            // Here is the callback function
            function(err, res) {
              if (err) throw err;
              console.log("Employee Added");
              MainChoice();
            }
          );
    }
    else if(employee.new)
    {
        const query = connection.query(
            "INSERT INTO employees SET ?",{first_name: employee.firstName, last_name: employee.lastName, role_id: employee.titleId},
            // Here is the callback function
            function(err, res) {
              if (err) throw err;
              console.log("Employee Added");
              MainChoice();
            }
          );
    }
    else
    {
        const query = connection.query(
            "UPDATE <tablename> SET ? WHERE ?",
            [
              // here is the data we want to change/update
              {
                role_id: employee.titleId,
                manager_id: employee.manager
              },
              // here are the conditions for which records get changed
              {
                id: employee.id
              }
            ],
            // callback function
            function(err, res) {
              if (err) throw err;
              console.log("Employee Updated");  // optional
              MainChoice();
            }
          );
    }
}

Init();

