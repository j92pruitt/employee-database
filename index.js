require('dotenv').config();

const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

async function init() {
    const db = await mysql.createConnection(
        {
        host: 'localhost',
        // MySQL username,
        user: process.env.DB_USER,
        // MySQL password
        password: process.env.DB_PASS,
        database: 'employee_db'
        },
    );

    // const [rows,] = await db.query('SELECT * FROM employee');

    // console.table(rows);

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
        selectDepartments();
    } else if (userChoice === "Add a Deparment") {
        createDepartment();
    } else if (userChoice === "View all Roles") {
        selectRoles();
    } else if (userChoice === "Add a Role") {
        createRole();
    } else if (userChoice === "View all Employees") {
        selectEmployees();
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

// TODO: Create function to handle select departments.
function selectDepartments() {
    console.log("Select Dapartments Chosen");
    return getUserChoice()
}

// TODO: Create function to handle creating new departments.
function createDepartment() {
    console.log("Create Dapartment Chosen");
    return getUserChoice()
}

// TODO: Create function to handle select roles.
function selectRoles() {
    console.log("Select Roles Chosen");
    return getUserChoice()
}

// TODO: Create function to handle creating new roles.
function createRole() {
    console.log("Create Role Chosen");
    return getUserChoice()
}

// TODO: Create function to handle select employees.
function selectEmployees() {
    console.log("Select Employees Chosen");
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
