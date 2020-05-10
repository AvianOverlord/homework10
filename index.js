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

function AddDepartment()
{
    inquirer.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "What is the department's name?"
        }
    ]).then(data => {
        departmentName = data.departmentName;
        const query = connection.query(
            "INSERT INTO departments SET ?",
            {departmentName: departmentName},
            // Here is the callback function
            function(err, res) {
              if (err) throw err;
              console.log(res.affectedRows + " department inserted!\n"); // optional
              res.json({status: "ok"});  // sample JSON response to client (highly changeable)
              MainChoice();
            }
          );
    });
}

function AddRole()
{
    connection.query("SELECT * FROM departments",data => {
        const departmentNames = data.map(Element => Element.name);
        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "What is the title of this positiion?"
            },
            {
                name: "salary",
                message: "What is this position's yearly salary?"
            },
            {
                type: "list",
                name: "department",
                message: "Which department is this position part of?",
                choices: departmentNames
            }
        ]).then(answers => {
            let targetId = -1;
            data.foreach(element => {
                if(element.name === answers.department)
                {
                    targetId = element.id;
                }
            })
            const query = connection.query(
                "INSERT INTO roles SET ?",
                // Here is the object w/ data to be inserted
                { title: answers.title, salary: answers.salary, department_id: targetId},
                // Here is the callback function
                function(err, res) {
                  if (err) throw err;
                  console.log(res.affectedRows + " role inserted!\n"); // optional
                  res.json({status: "ok"});  // sample JSON response to client (highly changeable)
                }
              );// 
              
        });
    })
}

MainChoice();