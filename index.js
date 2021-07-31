require('dotenv').config();

const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

async function main() {
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

    userChoice = await getUserSelection();
    console.log(`User choice is: ${userChoice}`)

}

async function getUserSelection(){
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
                "Update an Employee"
            ]
        }
    ]

    const answer = await inquirer.prompt(questions);

    return answer.dbAction
}

main();
