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
    connection.query("SELECT * FROM employees", function(err, allEmpResults)
    {
        if(err) throw err;
        inquirer.prompt([{
            type: "rawlist",
            name: "employee",
            message: "Which employee do you want to update?",
            choices: function() {
                let choiceArray = [];
                for (let i =0; i < allEmpResults.length; i++)
                {
                    choiceArray.push(allEmpResults[i].last_name); //Ask if if there's a way to add a value or id to these choices
                }
                return choiceArray;
             }
        }]).then(employeeAnswer =>{
            connection.query(`SELECT id FROM employees WHERE last_name = ${employeeAnswer.employee}`,function(err,resultsID){
                let employeeID = resultsID[0];
                connection.query("SELECT * FROM roles", function(err, allTitlesResult){
                    if(err) throw err;
                    inquirer.prompt([{
                        type: "rawlist",
                        name: "role",
                        message: "What is the employee's new role?",
                        choices: function() {
                            let choiceArray = [];
                            for (let i =0; i < allTitlesResult.length; i++)
                            {
                                choiceArray.push(allTitlesResult[i].title); //Ask if if there's a way to add a value or id to these choices
                            }
                            return choiceArray;
                         }
                    }]).then(roleAnswer =>{
                        connection.query(`SELECT id FROM roles WHERE title=${roleAnswer}`, function(err,roleID){
                            connection.query(
                                "UPDATE auctions SET ? WHERE ?",
                                [
                                  {
                                    role_id: roleID[0]
                                  },
                                  {
                                    id: employeeID
                                  }
                                ],
                                function(error) {
                                  if (error) throw err;
                                  console.log("Role updated successfully!");
                                  MainChoice();
                                }
                              );
                        });
                    });
                });
            });
        });
    });
}

function DisplayEmployees()
{
    connection.query("SELECT last_name, first_name FROM employees", function(err, results) //Ask about inserting in other files
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
              start();
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
                    const departmentID = idResult[0];
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
    connection.query("SELECT * FROM roles", function(err, results)
    {
        connection.query("SELECT * FROM employees", function(err, eResults)
        {
            if(results.length === 0)
            {
                console.log("Establish roles first");
            }
            else
            {
                inquirer.prompt([
                    {
                        name: "role",
                        type: "rawlist",
                        choices: function() {
                            let choiceArray = [];
                            for (let i =0; i < results.length; i++)
                                {
                                choiceArray.push(results[i].title); //Ask if if there's a way to add a value or id to these choices
                                }
                            return choiceArray;
                            },
                        message: "Which job will this employee be doing?"
                    },
                    {
                        type: "input",
                        name: "firstName",
                        message: "What is this employee's first name?"
                    },
                    {
                        type: "input",
                        name: "lastName",
                        message: "What is this employee's last name?"
                    },
                    {
                        name: "manager",
                        type: "rawlist",
                        choics: function() {
                            let choiceArray = [];
                            choiceArray.push("No one");
                            for (let i =0; i < eResults.length; i++)
                            {
                            choiceArray.push(eResults[i].last_name); //Ask if if there's a way to add a value or id to these choices
                            }
                            return choiceArray;
                        },
                        message: "Who is this employee's manager?"
                    }
                    ]).then
                    ( inquirer.prompt([
                        {
                            name: "role",
                            type: "rawlist",
                            choices: function() {
                                let choiceArray = [];
                                for (let i =0; i < results.length; i++)
                                    {
                                    choiceArray.push(results[i].title); //Ask if if there's a way to add a value or id to these choices
                                    }
                                return choiceArray;
                                },
                            message: "Which job will this employee be doing?"
                        },
                        {
                            type: "input",
                            name: "firstName",
                            message: "What is this employee's first name?"
                        },
                        {
                            type: "input",
                            name: "lastName",
                            message: "What is this employee's last name?"
                        },
                        {
                            name: "manager",
                            type: "rawlist",
                            choics: function() {
                                let choiceArray = [];
                                choiceArray.push("No one");
                                for (let i =0; i < eResults.length; i++)
                                {
                                choiceArray.push(eResults[i].last_name); //Ask if if there's a way to add a value or id to these choices
                                }
                                return choiceArray;
                            },
                            message: "Who is this employee's manager?"
                        }
                        ]).then(answers => {
                            connection.query(`SELECT id FROM roles WHERE title='${answers.title}'`,function(err,idResult){
                                if(err) throw err;
                                const titleID = idResult[0];
                                if(answers.manager === "No one")
                                {
                                    connection.query(
                                        "INSERT INTO employees SET ?",
                                        {
                                            first_name: answers.firstName,
                                            last_name: answers.lastName,
                                            role_id: titleID
                                        },
                                        function(err) {
                                        if (err) throw err;
                                        console.log("Employee added.");
                                        MainChoice();
                                        }
                                    );//
                                }
                                else
                                {
                                    connection.query(`SELECT id FROM employees WHERE last_name = ${answers.manager}`, function(err,idResultManager)
                                    {
                                        if(err) throw err;
                                        const managerID = idResultManager[0];
                                        connection.query(
                                            "INSERT INTO employees SET ?",
                                            {
                                                first_name: answers.firstName,
                                                last_name: answers.lastName,
                                                role_id: titleID,
                                                manager_id: managerID
                                            },
                                            function(err) {
                                            if (err) throw err;
                                            console.log("Employee added.");
                                            MainChoice();
                                            }
                                        );
                                    })
                                }
                  });
                }));//
            }//
        });//     
    });//
}//

Init();

