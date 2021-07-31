require('dotenv').config();

const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

let db;

async function init() {
     db = await mysql.createConnection(
        {
        host: 'localhost',
        // MySQL username,
        user: process.env.DB_USER,
        // MySQL password
        password: process.env.DB_PASS,
        database: 'employee_db'
        },
    );

    return getUserChoice();
}

async function getUserChoice(){
    const questions = [
        {
            type: "list",
            name: "dbAction",
            message: "What would you like to do?",
            choices: [
                "View all Departments",
                "Add a Deparment",
                "View all Roles",
                "Add a Role",
                "View all Employees",
                "Add an Employee",
                "Update an Employee",
                "Quit"
            ]
        }
    ]

    const answer = await inquirer.prompt(questions);

    return handleUserChoice(answer.dbAction)
}

function handleUserChoice (userChoice) {

    if (userChoice === "View all Departments") {
        selectFrom('department');
    } else if (userChoice === "Add a Deparment") {
        createDepartment();
    } else if (userChoice === "View all Roles") {
        selectFrom('role');
    } else if (userChoice === "Add a Role") {
        createRole();
    } else if (userChoice === "View all Employees") {
        selectFrom('employee');
    } else if (userChoice === "Add an Employee") {
        createEmployee();
    } else if (userChoice === "Update an Employee") {
        updateEmployee();
    }else if ("Quit") {
        return process.exit()
    } else {
        return Error("Unexpected User Chioce")
    }

}

/**
 * Gets data from provided table in database and displays it in a console table.
 * @param {string} table 
 * @returns 
 */
async function selectFrom(table) {
    
    const [rows,] = await db.query(`SELECT * FROM ${table}`);

    console.table(rows);

    return getUserChoice()
}

// TODO: Create function to handle creating new departments.
async function createDepartment() {
    
    const answer = await inquirer.prompt(
        [
            {
                type: 'input',
                name: 'departmentName',
                message: 'What is the name of the new department?'
            }
        ]
    )

    const [dbresponse,] = await db.query(`INSERT INTO department (name) VALUES ("${answer.departmentName}")`)

    console.log(`New department created with id: ${dbresponse.insertId}`)

    return getUserChoice()
}

// TODO: Create function to handle creating new roles.
function createRole() {
    console.log("Create Role Chosen");
    return getUserChoice()
}

// TODO: Create function to handle creating new employees.
function createEmployee() {
    console.log("Create Employee Chosen");
    return getUserChoice()
}

// TODO: Create function to handle updating existing employees.
function updateEmployee() {
    console.log("Update Employee Chosen");
    return getUserChoice()
}

init();
