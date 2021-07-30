require('dotenv').config();

const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: process.env.DB_USER,
      // MySQL password
      password: process.env.DB_PASS,
      database: 'employee_db'
    },
);

db.query('SELECT * FROM employee', (err, results) => {
    if (err) {
        console.error(err);
    } else {
        console.log(results);
    }
});