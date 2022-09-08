INSERT INTO departments (department_name)
VALUES ("Sales Dept."),
("Engineer HQ"),
("Finance Dept."),
("Legal Dept.");

INSERT INTO roles (role_title, role_salary, department_id)
VALUES ("Sales Lead", 35000, 001),
("Sales Representative", 20000, 001),
("Senior Software Engineer", 200000, 002),
("Software Engineer", 120000, 002),
("Head of Accounting", 175000, 003),
("Accountant", 120000, 003),
("Chief Legal Officer", 275000, 004),
("Lawyer", 200000, 004);

INSERT INTO employees (employee_first_name, employee_last_name, role_id, manager_id)
VALUES ("Jonathan", "Gordon", 001, NULL),
("Chris", "Tucker", 002, 001),
("Michelle", "Pineda", 003, NULL),
("Harry", "Bhasin", 004, 003),
("John", "Rabuse", 005, NULL),
("Rigel", "Lopez", 006, 005),
("Timothy", "Cabrera", 007, NULL),
("Mackenzie", "Sanders", 008, 007);
