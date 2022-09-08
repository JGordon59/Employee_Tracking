INSERT INTO departments (department_name)
VALUES ("Sales"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO roles (role_title, role_salary, department_id)
VALUES ("Sales Lead", 100000, 001),
("Salesperson", 80000, 001),
("Lead Engineer", 150000, 002),
("Software Engineer", 120000, 002),
("Account Manager", 160000, 003),
("Accountant", 125000, 003),
("Legal Team Lead", 250000, 004),
("Lawyer", 190000, 004);

INSERT INTO employees (employee_first_name, employee_last_name, role_id, manager_id)
VALUES ("John", "Doe", 001, NULL),
("Mike", "Chan", 002, 001),
("Ashley", "Rodriguez", 003, NULL),
("Kevin", "Tupik", 004, 003),
("Kunal", "Singh", 005, NULL),
("Malia", "Brown", 006, 005),
("Sarah", "Lourd", 007, NULL),
("Tom", "Allen", 008, 007);
