const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'employees_db'
    },
    console.log(`You have successfully connected to the employee database.`)
);

let manager = [];
let employee = [];
let dapartment = [];
let role = [];


const updateInfo = () => {
    db.query('SELECT CONCAT(department_id, ": ", department_name) AS department_name FROM departments', function (err, results) {
        if (err) {
            console.error(err);
        } else {
            dapartment.splice(0, 0);
            for (var i = 0; i < results.length; i++) {
                var row = results[i];
                dapartment.push(row.department_name);
            }
            return dapartment;
        }
    });

    db.query('SELECT CONCAT(role_id, ": ", role_title) AS role_title FROM roles', function (err, results) {
        if (err) {
            console.error(err);
        } else {
            role.splice(0, 0);
            for (var i = 0; i < results.length; i++) {
                var row = results[i];
                role.push(row.role_title);
            }
            return role;
        }
    });

    db.query('SELECT CONCAT(employee_first_name, " ", employee_last_name, " ID: ", employee_id) AS managerInfo FROM employees WHERE manager_id IS NULL', function (err, results) {
        if (err) {
            console.error(err);
        } else {
            manager.splice(0, 0);
            for (var i = 0; i < results.length; i++) {
                var row = results[i];
                manager.push(row.managerInfo);
            }
            return manager;
        }
    });

    db.query('SELECT CONCAT(employee_first_name, " ", employee_last_name, " ID: ", employee_id) AS employeeInfo FROM employees', function (err, results) {
        if (err) {
            console.error(err);
        } else {
            employee.splice(0, 0);
            for (var i = 0; i < results.length; i++) {
                var row = results[i];
                employee.push(row.employeeInfo);
            }
            return employee;
        }
    });
}

const questions = [
    {
        type: 'list',
        name: 'proceed',
        message: 'Which category would you like to view?',
        choices: ['Departments', 'Roles', 'Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Exit'],
        default: 0
    },
    {
        type: 'input',
        name: `departmentName`,
        message: `What department would you like to add?`,
        when(answers) {
            return answers.proceed === 'Add a Department'
        },
        validate: newDepartment => {
            if (typeof newDepartment == 'string' && newDepartment.length <= 30) {
                return true;
            } else {
                console.log('Please enter in a department name to continue.');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: `titleOfRole`,
        message: `What is the name of the new role you'd like to add?`,
        when(answers) {
            return answers.proceed === 'Add a Role'
        },
        validate: newRoleTitle => {
            if (typeof newRoleTitle == 'string' && newRoleTitle.length <= 30) {
                return true;
            } else {
                console.log('Please enter in the name of the new role to continue.');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: `SalaryOfRole`,
        message: `What is the salary for your new role?`,
        when(answers) {
            return answers.proceed === 'Add a Role'
        },
        validate: newRoleSalary => {
            if (/^\d+$/.test(newRoleSalary)) {
                return true;
            } else {
                console.log('This role has to make a salary, they cannot work for free!');
                return false;
            }
        }
    },
    {
        type: 'list',
        name: `departmentOfRole`,
        message: `Please specify the department that this role is matched to?`,
        when(answers) {
            return answers.proceed === 'Add a Role'
        },
        choices: dapartment,
        default: 0,
        filter(answer) {
            let position = answer.search(/:/);
            let departmentRow = answer.substring(0, position);
            return parseInt(departmentRow);
        }
    },
    {
        type: 'input',
        name: `employeeFN`,
        message: `Please provide new employee's First Name`,
        when(answers) {
            return answers.proceed === 'Add an Employee'
        },
        validate: employeeFN => {
            if (typeof employeeFN == 'string' && employeeFN.length <= 30) {
                return true;
            } else {
                console.log('Employee must have a first name.');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: `employeeSN`,
        message: `Please provide employee's Last Name?`,
        when(answers) {
            return answers.proceed === 'Add an Employee'
        },
        validate: employeeSN => {
            if (typeof employeeSN == 'string' && employeeSN.length <= 30) {
                return true;
            } else {
                console.log('Employee must have a last name.');
                return false;
            }
        }
    },
    {
        type: 'list',
        name: `employeeIdentification`,
        message: `What is this employee's role?`,
        when(answers) {
            return answers.proceed === 'Add an Employee'
        },
        choices: role,
        default: 0,
        filter(answer) {
            let position = answer.search(/:/);
            let roleRow = answer.substring(0, position);
            return parseInt(roleRow);
        }
    },
    {
        type: 'list',
        name: `newManagerID`,
        message: `Who is this employee's manager?`,
        when(answers) {
            return answers.proceed === 'Add an Employee'
        },
        choices: manager,
        default: 0,
        filter(answer) {
            let position = answer.search(/:/);
            let managerRow = answer.substring(position + 1);
            return parseInt(managerRow);
        }
    },
    {
        type: 'list',
        name: `changeEmpID`,
        message: `Which employee would you like to update?`,
        when(answers) {
            return answers.proceed === 'Update an Employee Role'
        },
        choices: employee,
        default: 0,
        filter(answer) {
            let position = answer.search(/:/);
            let employeeRow = answer.substring(position + 1);
            return parseInt(employeeRow);
        }
    },
    {
        type: 'list',
        name: `changeRoleID`,
        message: `What role will this employee be performing?`,
        when(answers) {
            return answers.proceed === 'Update an Employee Role'
        },
        choices: role,
        default: 0,
        filter(answer) {
            let position = answer.search(/:/);
            let roleRow = answer.substring(0, position);
            return parseInt(roleRow);
        }
    }
]

const init = () => {
    inquirer
        .prompt(questions)
        .then((response) => {
            if (response.proceed == 'View All Departments') {
                db.query('SELECT * FROM departments', function (err, results) {
                    if (err) {
                        console.error(err);
                    } else {
                        updateInfo();
                        console.table(results);
                    }
                });
                init();
            } else if (response.proceed == 'View All Roles') {
                db.query('SELECT roles.role_id, roles.role_title, roles.role_salary, departments.department_name FROM roles JOIN departments ON roles.department_id = departments.department_id ORDER BY roles.role_id ASC', function (err, results) {
                    if (err) {
                        console.error(err);
                    } else {
                        updateInfo();
                        console.table(results);
                    }
                });
                init();
            } else if (response.proceed == 'View All Employees') {
                db.query('SELECT employees.employee_id, employees.employee_first_name, employees.employee_last_name, roles.role_title, departments.department_name as Department, roles.role_salary, CONCAT(manager.employee_first_name, " ", manager.employee_last_name) as manager FROM employees LEFT JOIN roles ON employees.role_id = roles.role_id LEFT JOIN departments ON roles.department_id = departments.department_id LEFT JOIN employees manager ON manager.employee_id = employees.manager_id', function (err, results) {
                    if (err) {
                        console.error(err);
                    } else {
                        updateInfo();
                        console.table(results);
                    }
                });
                init();
            } else if (response.proceed == 'Add a Department') {
                db.query('INSERT INTO departments (department_name) VALUES (?)', response.newDepartment, function (err, results) {
                    if (err) {
                        console.error(err);
                    } else {
                        updateInfo();
                        console.log(`\nAdded the ${response.newDepartment} department!`);
                    }
                });
                init();
            } else if (response.proceed == 'Add a Role') {
                db.query('INSERT INTO roles (role_title, role_salary, department_id) VALUES (?, ?, ?)', [response.newRoleTitle, response.newRoleSalary, response.newRoleDepartment], function (err, results) {
                    if (err) {
                        console.error(err);
                    } else {
                        updateInfo();
                        console.log(`\nAdded the ${response.newRoleTitle} role!`);
                    }
                });
                init();
            } else if (response.proceed == 'Add an Employee') {
                db.query('INSERT INTO employees (employee_first_name, employee_last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [response.employeeFN, response.employeeSN, response.employeeIdentification, response.newManagerID], function (err, results) {
                    if (err) {
                        console.error(err);
                    } else {
                        updateInfo();
                        console.log(`\nAdded ${response.employeeFN} ${response.employeeSN} to the employee database!`);
                    }
                });
                init();
            } else if (response.proceed == 'Update an Employee Role') {
                db.query('UPDATE employees SET role_id = ? WHERE employee_id = ?', [response.changeRoleID, response.changeEmpID], function (err, results) {
                    if (err) {
                        console.error(err);
                    } else {
                        updateInfo();
                        console.log(`\nUpdated this employee's role!`);
                    }
                });
                init();
            } else {
                console.log();
                process.exit(0);
            }
        });
}

init();

