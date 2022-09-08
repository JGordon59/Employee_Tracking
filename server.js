// importing dependencies
const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'rootroot',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

// declaring empty global arrays to store updated database info
let departments = [];
let roles = [];
let managers = [];
let employees = [];

// function to update all db info during the CLI
const updateInfo = () => {
    // querying for all department ids and names in a particular format
    db.query('SELECT CONCAT(department_id, ": ", department_name) AS department_name FROM departments', function (err, results) {
        // catching any errors
        if (err) {
            console.error(err);
        } else {
            // clearing the departments array if there is anything in it
            departments.splice(0, 0);
            // looping over the results object array
            for (var i = 0; i < results.length; i++) {
                var row = results[i];
                // pushing each result into the departments array
                departments.push(row.department_name);
            }
            return departments;
        }
    });

    // querying for all role ids and names in a particular format
    db.query('SELECT CONCAT(role_id, ": ", role_title) AS role_title FROM roles', function (err, results) {
        // catching any errors
        if (err) {
            console.error(err);
        } else {
            // clearing the roles array if there is anything in it
            roles.splice(0, 0);
            // looping over the results object array
            for (var i = 0; i < results.length; i++) {
                var row = results[i];
                // pushing each result into the roles array
                roles.push(row.role_title);
            }
            return roles;
        }
    });

    // querying for all manager ids and names in a particular format
    db.query('SELECT CONCAT(employee_first_name, " ", employee_last_name, " ID: ", employee_id) AS managerInfo FROM employees WHERE manager_id IS NULL', function (err, results) {
        // catching any errors
        if (err) {
            console.error(err);
        } else {
            // clearing the managers array if there is anything in it
            managers.splice(0, 0);
            // looping over the results object array
            for (var i = 0; i < results.length; i++) {
                var row = results[i];
                // pushing each result into the managers array
                managers.push(row.managerInfo);
            }
            return managers;
        }
    });

    // querying for all employee ids and names in a particular format
    db.query('SELECT CONCAT(employee_first_name, " ", employee_last_name, " ID: ", employee_id) AS employeeInfo FROM employees', function (err, results) {
        // catching any errors
        if (err) {
            console.error(err);
        } else {
            // clearing the employees array if there is anything in it
            employees.splice(0, 0);
            // looping over the results object array
            for (var i = 0; i < results.length; i++) {
                var row = results[i];
                // pushing each result into the employees array
                employees.push(row.employeeInfo);
            }
            return employees;
        }
    });
}

// all questions for user input. changes depending on answer to proceed
const questions = [
    {
        type: 'list',
        name: 'proceed',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Finish'],
        default: 0
    },
    {
        type: 'input',
        name: `newDepartment`,
        message: `What is the name of the new deparment?`,
        // only asking this question when the user wants to add a department
        when(answers) {
            return answers.proceed === 'Add a Department'
        },
        // validating that a valid department name was given
        validate: newDepartment => {
            if (typeof newDepartment == 'string' && newDepartment.length <= 30) {
                return true;
            } else {
                console.log('Please enter a valid department name.');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: `newRoleTitle`,
        message: `What is the title of the new role?`,
        // only asking this question when the user wants to add a role
        when(answers) {
            return answers.proceed === 'Add a Role'
        },
        // validating that a valid title was given
        validate: newRoleTitle => {
            if (typeof newRoleTitle == 'string' && newRoleTitle.length <= 30) {
                return true;
            } else {
                console.log('Please enter a valid role title.');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: `newRoleSalary`,
        message: `What is the salary for this role?`,
        // only asking this question when the user wants to add a role
        when(answers) {
            return answers.proceed === 'Add a Role'
        },
        // validating that a number was given
        validate: newRoleSalary => {
            if (/^\d+$/.test(newRoleSalary)) {
                return true;
            } else {
                console.log('A valid salary is required for this role.');
                return false;
            }
        }
    },
    {
        type: 'list',
        name: `newRoleDepartment`,
        message: `What department does this role fall under?`,
        // only asking this question when the user wants to add a role
        when(answers) {
            return answers.proceed === 'Add a Role'
        },
        choices: departments,
        default: 0,
        filter(answer) {
            // fetching the department id based on the department name
            let position = answer.search(/:/);
            let departmentRow = answer.substring(0, position);
            return parseInt(departmentRow);
        }
    },
    {
        type: 'input',
        name: `newEmployeeFirstName`,
        message: `What is this employee's First Name?`,
        // only asking this question when the user wants to add an employee
        when(answers) {
            return answers.proceed === 'Add an Employee'
        },
        // validating that a string was given
        validate: newEmployeeFirstName => {
            if (typeof newEmployeeFirstName == 'string' && newEmployeeFirstName.length <= 30) {
                return true;
            } else {
                console.log('Please enter a valid first name.');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: `newEmployeeLastName`,
        message: `What is this employee's Last Name?`,
        // only asking this question when the user wants to add an employee
        when(answers) {
            return answers.proceed === 'Add an Employee'
        },
        // validating that a string was given
        validate: newEmployeeLastName => {
            if (typeof newEmployeeLastName == 'string' && newEmployeeLastName.length <= 30) {
                return true;
            } else {
                console.log('Please enter a valid last name.');
                return false;
            }
        }
    },
    {
        type: 'list',
        name: `newEmployeeRoleId`,
        message: `What is this employee's role?`,
        // only asking this question when the user wants to add an employee
        when(answers) {
            return answers.proceed === 'Add an Employee'
        },
        choices: roles,
        default: 0,
        filter(answer) {
            // fetching the role id based on the role name
            let position = answer.search(/:/);
            let roleRow = answer.substring(0, position);
            return parseInt(roleRow);
        }
    },
    {
        type: 'list',
        name: `newEmployeeManagerId`,
        message: `Who is this employee's manager?`,
        // only asking this question when the user wants to add an employee
        when(answers) {
            return answers.proceed === 'Add an Employee'
        },
        choices: managers,
        default: 0,
        filter(answer) {
            // fetching the manager id based on the manager name
            let position = answer.search(/:/);
            let managerRow = answer.substring(position + 1);
            return parseInt(managerRow);
        }
    },
    {
        type: 'list',
        name: `updateEmployeeId`,
        message: `Which employee would you like to update?`,
        // only asking this question when the user wants to update an employee role
        when(answers) {
            return answers.proceed === 'Update an Employee Role'
        },
        choices: employees,
        default: 0,
        filter(answer) {
            // fetching the employee id based on the employee name
            let position = answer.search(/:/);
            let employeeRow = answer.substring(position + 1);
            return parseInt(employeeRow);
        }
    },
    {
        type: 'list',
        name: `updateRoleId`,
        message: `Which role would you like to assign this employee?`,
        // only asking this question when the user wants to update an employee role
        when(answers) {
            return answers.proceed === 'Update an Employee Role'
        },
        choices: roles,
        default: 0,
        filter(answer) {
            // fetching the role id based on the role name
            let position = answer.search(/:/);
            let roleRow = answer.substring(0, position);
            return parseInt(roleRow);
        }
    }
]

// initialization function and logic handling for all possible requests
const init = () => {
    inquirer
        .prompt(questions)
        .then((response) => {
            if (response.proceed == 'View All Departments') {
                // running a query to select only the department id and name
                db.query('SELECT * FROM departments', function (err, results) {
                    // catching any errors
                    if (err) {
                        console.error(err);
                        // tabling the results
                    } else {
                        updateInfo();
                        console.table(results);
                    }
                });
                // running the prompt again
                init();
            } else if (response.proceed == 'View All Roles') {
                db.query('SELECT roles.role_id, roles.role_title, roles.role_salary, departments.department_name FROM roles JOIN departments ON roles.department_id = departments.department_id ORDER BY roles.role_id ASC', function (err, results) {
                    // catching any errors
                    if (err) {
                        console.error(err);
                        // tabling the results
                    } else {
                        updateInfo();
                        console.table(results);
                    }
                });
                // running the prompt again
                init();
            } else if (response.proceed == 'View All Employees') {
                db.query('SELECT employees.employee_id, employees.employee_first_name, employees.employee_last_name, roles.role_title, departments.department_name as Department, roles.role_salary, CONCAT(manager.employee_first_name, " ", manager.employee_last_name) as manager FROM employees LEFT JOIN roles ON employees.role_id = roles.role_id LEFT JOIN departments ON roles.department_id = departments.department_id LEFT JOIN employees manager ON manager.employee_id = employees.manager_id', function (err, results) {
                    // catching any errors
                    if (err) {
                        console.error(err);
                        // tabling the results
                    } else {
                        updateInfo();
                        console.table(results);
                    }
                });
                // running the prompt again
                init();
            } else if (response.proceed == 'Add a Department') {
                db.query('INSERT INTO departments (department_name) VALUES (?)', response.newDepartment, function (err, results) {
                    // catching any errors
                    if (err) {
                        console.error(err);
                        // tabling the results
                    } else {
                        updateInfo();
                        console.log(`\nAdded the ${response.newDepartment} department!`);
                    }
                });
                // running the prompt again
                init();
            } else if (response.proceed == 'Add a Role') {
                db.query('INSERT INTO roles (role_title, role_salary, department_id) VALUES (?, ?, ?)', [response.newRoleTitle, response.newRoleSalary, response.newRoleDepartment], function (err, results) {
                    // catching any errors
                    if (err) {
                        console.error(err);
                    } else {
                        // logging results
                        updateInfo();
                        console.log(`\nAdded the ${response.newRoleTitle} role!`);
                    }
                });
                // running the prompt again
                init();
            } else if (response.proceed == 'Add an Employee') {
                // querying the db to insert the new employee
                db.query('INSERT INTO employees (employee_first_name, employee_last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [response.newEmployeeFirstName, response.newEmployeeLastName, response.newEmployeeRoleId, response.newEmployeeManagerId], function (err, results) {
                    // catching any errors
                    if (err) {
                        console.error(err);
                    } else {
                        // displaying the results
                        updateInfo();
                        console.log(`\nAdded ${response.newEmployeeFirstName} ${response.newEmployeeLastName} to the employee database!`);
                    }
                });
                // running the prompt again
                init();
            } else if (response.proceed == 'Update an Employee Role') {
                // querying the db to update the employee's role
                db.query('UPDATE employees SET role_id = ? WHERE employee_id = ?', [response.updateRoleId, response.updateEmployeeId], function (err, results) {
                    // catching any errors
                    if (err) {
                        console.error(err);
                        // tabling the results
                    } else {
                        updateInfo();
                        console.log(`\nUpdated this employee's role!`);
                    }
                });
                // running the prompt again
                init();
            } else {
                console.log(`Thank you for choosing Dennis Callaghan's Employee Tracker! To donate to the cause, please visit https://www.paypal.com/paypalme/my/profile to support my future projects.`);
                process.exit(0);
            }
        });
}

init();

// keep adding db queries and console tables as needed for all future options
// add src file for questions and flush out inquirer prompt