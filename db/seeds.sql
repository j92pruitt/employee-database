USE employee_db;

INSERT INTO department (name)
VALUES ("Purchasing"), ("Service"), ("Marketing"), ("Production"), ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES 
    ("Accounts Payable", 30000, 1),
    ("CSR", 27000, 2),
    ("Marketing Manager", 27000, 3),
    ("Planner", 34000, 4),
    ("Vice President", 150000, 5),
    ("CEO", 500000, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Carlos", "Vasquez", 6, NULL),
    ("John", "Vasquez", 5, 1),
    ("Isabella", "Guzman", 2, 2),
    ("Megan", "Markle", 3, 2),
    ("Joseph", "Payne", 4, 2),
    ("Diane", "Arandas", 1, 2);