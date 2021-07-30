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

    const [rows,] = await db.query('SELECT * FROM employee');

    console.table(rows)

    // db.query('SELECT * FROM employee', (err, results) => {
    //     if (err) {
    //         console.error(err);
    //     } else {
    //         console.log(results);
    //     }
    // });
}

main();
