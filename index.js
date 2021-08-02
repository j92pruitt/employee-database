require('dotenv').config();

const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

let db;

/**
 * Initializes program with a database connection
 * @returns /Return is a call to {@link getUserChoice}
 */
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

/**
 * Gets input from user on what action they would like to take with the database.
 * @returns /Return is a call {@link handleUserChoice}
 */
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
                "Update an Employee's Role",
                "Quit"
            ]
        }
    ]

    const answer = await inquirer.prompt(questions);

    return handleUserChoice(answer.dbAction)
}

/**
 * Switchboard which calls the correct function based on provided input.
 * @param {string} userChoice 
 * @returns /Returns an error if choice is not on the list.
 */
function handleUserChoice (userChoice) {

    if (userChoice === "View all Departments") {
        selectFromDepartment();
    } else if (userChoice === "Add a Deparment") {
        createDepartment();
    } else if (userChoice === "View all Roles") {
        selectFromRole('role');
    } else if (userChoice === "Add a Role") {
        createRole();
    } else if (userChoice === "View all Employees") {
        selectFromEmployee('employee');
    } else if (userChoice === "Add an Employee") {
        createEmployee();
    } else if (userChoice === "Update an Employee's Role") {
        updateEmployeeRole();
    }else if ("Quit") {
        return process.exit()
    } else {
        return Error("Unexpected User Chioce")
    }

}

async function selectFromDepartment() {
    
    const [rows,] = await db.query(`SELECT * FROM department`);

    console.table(rows);

    return getUserChoice()
}

async function selectFromRole() {
    
    const [rows,] = await db.query(`SELECT role.id, role.title, role.salary, department.name AS department FROM role INNER JOIN department ON role.department_id=department.id`);

    console.table(rows);

    return getUserChoice()
}

async function selectFromEmployee() {
    
    const [rows,] = await db.query(`
    SELECT 
    e.first_name,
    e.last_name,
    role.title,
    CONCAT(m.first_name, ' ', m.last_name) AS 'Manager'
FROM
    employee e
LEFT JOIN employee m ON 
    m.id = e.manager_id
JOIN role ON
    role.id = e.role_id`);

    console.table(rows);

    return getUserChoice()
}

/**
 * Creates a new record in the departments table using the user supplied name.
 * @returns 
 */
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

/**
 * Creates a new record in the roles table, using supplied name and salary. Queries database for current list of departments for the user to select from the enforce database relations.
 * @returns /Return is a call to {@link getUserChoice}
 */
async function createRole() {

    const [currentDepartments,] = await db.query('SELECT * FROM department');

    const departmentName = currentDepartments.map( (record) => record.name );
    
    const answer = await inquirer.prompt(
        [
            {
                type: 'input',
                name: 'roleName',
                message: 'What is the name of the new role?'
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: 'What is the salary?'
            },
            {
                type: 'list',
                name: 'departmentName',
                message: 'What department does this role belong to?',
                choices: departmentName
            }
        ]
    );
    
    const indexOfUserChoice = departmentName.indexOf(answer.departmentName);

    const departmentID = currentDepartments[indexOfUserChoice].id;

    const [dbresponse,] = await db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answer.roleName}", ${parseInt(answer.roleSalary)}, ${departmentID})`);

    console.log(`New role created with id: ${dbresponse.insertId}`);

    return getUserChoice()
};

/**
 * Creates a new record in employee table with using supplied first and last name. Allows user to select an existing role for the employee and assign an existing employee as their manager.
 * @returns /Return is a call to {@link getUserChoice} 
 */
async function createEmployee() {

    const [currentRoles,] = await db.query('SELECT * FROM role');
    const [currentEmployees] = await db.query('SELECT * FROM employee');

    const roleNames = currentRoles.map( (record) => record.title );
    const employeeNames = currentEmployees.map( (record) => record.first_name + " " + record.last_name )
    
    const answer = await inquirer.prompt(
        [
            {
                type: 'input',
                name: 'firstName',
                message: "What is the employee's first name?"
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What is the employee's last name?"
            },
            {
                type: 'list',
                name: 'role',
                message: 'What role does this employee have?',
                choices: roleNames
            },
            {
                type: 'list',
                name: 'managerName',
                message: "Who is the employee's manager?",
                choices: employeeNames
            }
        ]
    );
    
    const indexOfUserChoice = roleNames.indexOf(answer.role);

    const roleID = currentRoles[indexOfUserChoice].id;

    const [managerFirstName, managerLastName] = answer.managerName.split(" ")

    let managerID

    for (let index = 0; index < currentEmployees.length; index++) {

        const record = currentEmployees[index];

        if (record.first_name === managerFirstName) {

            if (record.last_name === managerLastName) {

                managerID = record.id

            }
        }
    }

    const [dbresponse,] = await db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.firstName}", "${answer.lastName}", "${roleID}", "${managerID}")`);

    console.log(`New employee created with id: ${dbresponse.insertId}`);
    return getUserChoice()
}

/**
 * Updates the record of the user selected employee to the user selected role.
 * @returns /Return is a call to {@link getUserChoice}
 */
async function updateEmployeeRole() {
    
    const [currentRoles,] = await db.query('SELECT * FROM role');
    const [currentEmployees] = await db.query('SELECT * FROM employee');

    const roleNames = currentRoles.map( (record) => record.title );
    const employeeNames = currentEmployees.map( (record) => record.first_name + " " + record.last_name )

    const answer = await inquirer.prompt(
        [
            {
                type: 'list',
                name: 'employeeName',
                message: "Which employee's role would you like to update?",
                choices: employeeNames
            },
            {
                type: 'list',
                name: 'newRole',
                message: "What is the employee's new role?",
                choices: roleNames
            }
        ]
    );

    const indexOfUserChoice = roleNames.indexOf(answer.newRole);

    const roleID = currentRoles[indexOfUserChoice].id;

    const [employeeFirstName, employeeLastName] = answer.employeeName.split(" ");

    let employeeID

    for (let index = 0; index < currentEmployees.length; index++) {

        const record = currentEmployees[index];

        if (record.first_name === employeeFirstName) {

            if (record.last_name === employeeLastName) {

                employeeID = record.id

            }
        }
    }

    const[dbresponse,] = await db.query(`UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`);

    console.log(dbresponse)

    return getUserChoice()
}

init();
