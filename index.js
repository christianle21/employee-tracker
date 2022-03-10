const mysql = require('mysql12');
const inquirer = require('inquirer');
const consoleTable = require('consol.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    },
    console.log(`You are now connected to the employee_db database!`)
);

menu();

function menu() {
    inquirer.prompt([
        type: 'list',
        name: 'menu bar',
        choices: ['Display data',
                  'Add data',
                  'Update employee role',
                  'Exit'],
        description: 'What would you like to do?'
}, 
    ]).then(res => {
        switch (res.menu) {
            case ('Display data'):
                displayData();
                break;
            case ('Add data'):
                addData();
                break;
            case ('Updated employee role'):
                updateData();
                break;
            default:
                console.log('See ya!');
                process.exit();
        }
    });
};

function displayData() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'selection',
            choices: ['View all employees',
                      'View all departments',
                      'View all roles'],
            description: 'Which data would you like to see?'
        },
    ]).then(res => {
        switch (res.selection) {
            case ('View all employees'):
                db.query('SELECT * FROM employees', (err, data) => {
                    if (err) { throw err }
                    else { console.table(data) }
                    continueProgram();
                });
                break;
            case ('View all departments'):
                db.query('SELECT * FROM departments', (err, data) => {
                    if (err) { throw err }
                    else { console.table(data) }
                    continueProgram();
                });
                break;
            default:
                console.log('See ya!');
                process.exit();
        }
    });
};

function addData() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'selection',
            choices: ['Add an employee',
                      'Add a role',
                      'Add a department'],
            description: 'What data would you like to add?'
        },
    ]).then(res => {
        switch (res.selection) {
            case ('Add an employee'):
                addEmployee();
                break;
            case ('Add a role'):
                addRole();
                break;
            case ('Add a department'):
                addDepartment();
                break;
            default:
                console.log('See ya!');
                process.exit();
        }
    });
};

function continueProgram() {
    inquirer.prompt(
        {
            type: 'list',
            message: 'Would you like to continue?',
            choices: ['Continue',
                      'Exit'],
            name: 'Continue'
        }
    ),then(res => {
        var confirm = res.continue;
        if (confirm === 'Continue') {
            menu();
        } else {
            console.log('See ya!');
            process.exit();
        }
    });
};

const currentEmployees = () => {
    const holdingArray = []
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM employee;`, (err, data) => {
            if (err) { reject(err) }
            else {
                for (let i = 0; i < data.length; i++) {
                    holdingArray.push(data[i].first_name + '' + data[i].last_name);
                }
                resolve(holdingArray)
            }
        });
    });
};

const currentRoles = () => {
    const tempArray = []
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM roles;`, (err, results) => {
            if (err) { reject(err) }
            else {
                for (let i =0; i < results.lenth; i++) {
                    tempArray.push(results[i].title);
                }
                resolve(tempArray)
            }
        });
    });
};

const currentDepartment = () => {
    const tempArray = []
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM department;`, (err, results) => {
            if (err) { reject(err); }
            else {
                for (let i = 0; i < results.length; i++) {
                    tempArray.push(results[i].department_name);
                }
                resolve(tempArray)
            }
        });
    });
}; 

const departmentID = () => {
    
} 
// Function to return departments onto the console
const viewDepartments = async () => {
  const allDepartments = await db.query(err, results
    'SELECT department.id as "Department ID", name as "Department Name", title as "Role Title", salary as "Salary" FROM department LEFT JOIN role ON role.department_id = department.id'
  );
  console.log("\n");
  console.table(allDepartments);
  console.log("\n");
  console.log("\n");
  console.log("Press the Up or Down arrow to return to the menu options");
};

// Function to return roles onto the console
const viewRoles = async () => {
  const allRoles = await db.query(
    'SELECT role.id as "Role ID", title as "Role Title", salary as "Salary", name as "Department" FROM role RIGHT JOIN department ON role.department_id = department.id'
  );
  console.log("\n");
  console.table(allRoles);
  console.log("\n");
  console.log("\n");
  console.log("Press the Up or Down arrow to return to the menu options");
};

// Function to return employees onto the console
const viewEmployees = async () => {
  const allEmployees = await db.query(
    'SELECT a.id as "Employee ID", a.first_name as "First Name", a.last_name as "Last Name", title as "Title", CONCAT(b.first_name," ",b.last_name) as "Manager\'s Name", name as "Department" FROM employee a LEFT JOIN employee b on a.manager_id = b.id LEFT JOIN role ON a.role_id = role.id LEFT JOIN department ON role.department_id = department.id'
  );
  console.log("\n");
  console.table(allEmployees);
  console.log("\n");
  console.log("\n");
  console.log("Press the Up or Down arrow to return to the menu options");
};

// Function to return employees by their manager onto the console
const viewEmployeesByManager = async () => {
  const allEmployees = await db.query(
    'SELECT a.id as "Manager ID", a.first_name as "First Name", a.last_name as "Last Name", title as "Title", CONCAT(b.first_name," ",b.last_name) as "Direct Report\'s Name", name as "Department" FROM employee a INNER JOIN employee b on b.manager_id = a.id LEFT JOIN role ON a.role_id = role.id LEFT JOIN department ON role.department_id = department.id'
  );
  console.log("\n");
  console.table(allEmployees);
  console.log("\n");
  console.log("\n");
  console.log("Press the Up or Down arrow to return to the menu options");
};

// Function to create a new entry in the department table
const addDepartment = async () => {
  const departmentQuestions = [
    {
      type: "input",
      name: "departmentName",
      message: "What is the name of the new department?",
    },
  ];
  const newDepartment = await inquirer.prompt(departmentQuestions);
  await db.parameterisedQuery(
    "INSERT INTO `employee_management_system`.`department` (`name`) VALUES (?);",
    [newDepartment.departmentName]
  );
};

// Function to create a new entry in the role table
const addRole = async () => {
  const allDepartments = await db.query(
    "SELECT department.id, name FROM department"
  );
  const departmentChoices = allDepartments.map((department) => {
    return department.name;
  });

  const roleQuestions = [
    {
      type: "input",
      name: "roleTitle",
      message: "What is the title of the new role?",
    },
    {
      type: "input",
      name: "roleSalary",
      message: "What is the salary?",
    },
    {
      type: "list",
      name: "roleDepartment",
      choices: departmentChoices,
    },
  ];

  const newRole = await inquirer.prompt(roleQuestions);
  const filteredDepartment = allDepartments.filter((department) => {
    if (department.name === newRole.roleDepartment) {
      return true;
    }
  });

  await db.parameterisedQuery(
    "INSERT INTO `employee_management_system`.`role` (`title`, `salary`, `department_id`) VALUES (?, ?, ?);",
    [newRole.roleTitle, newRole.roleSalary, filteredDepartment[0].id]
  );
};

// Function to create a new entry in the employee table
const addEmployee = async () => {
  const allRoles = await db.query("SELECT role.id, title FROM role");
  const roleChoices = allRoles.map((role) => {
    return role.title;
  });

  const employeeQuestions = [
    {
      type: "input",
      name: "firstName",
      message: "What is the first name of the new employee?",
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the last name of the new employee?",
    },
    {
      type: "list",
      name: "roleChoice",
      choices: roleChoices,
      message: "Select the role of the new employee:",
    },
  ];

  const newEmployee = await inquirer.prompt(employeeQuestions);
  const filteredRole = allRoles.filter((role) => {
    if (role.title === newEmployee.roleChoice) {
      return true;
    }
  });

  await db.parameterisedQuery(
    "INSERT INTO `employee_management_system`.`employee` (`first_name`, `last_name`, `role_id`) VALUES (?, ?, ?);",
    [newEmployee.firstName, newEmployee.lastName, filteredRole[0].id]
  );

  const managerQuestion = [
    {
      type: "confirm",
      name: "hasManager",
      message: "Does the new employee have a manager?",
    },
  ];

  const isManager = await inquirer.prompt(managerQuestion);

  if (isManager.hasManager) {
    const allEmployees = await db.query(
      "SELECT employee.id, first_name, last_name FROM employee_management_system.employee;"
    );
    const managerChoices = allEmployees.map((employee) => {
      return `${employee.first_name} ${employee.last_name}`;
    });
    const newEmployee = managerChoices.pop();

    const managerNameQuestion = [
      {
        type: "list",
        name: "managerChoice",
        choices: managerChoices,
        message: "Select the new employee's manager:",
      },
    ];

    const addManager = await inquirer.prompt(managerNameQuestion);
    const filteredManager = allEmployees.filter((employee) => {
      if (
        `${employee.first_name} ${employee.last_name}` ===
        addManager.managerChoice
      ) {
        return true;
      }
    });

    const employeeIndex = allEmployees.length - 1;
    await db.parameterisedQuery(
      "UPDATE `employee_management_system`.`employee` SET `manager_id` = ? WHERE (`id` = ?);",
      [filteredManager[0].id, allEmployees[employeeIndex].id]
    );
  }
};

// Function to update the selected employee's role
const updateEmployeeRole = async () => {
  const allEmployees = await db.query(
    "SELECT employee.id, first_name, last_name FROM employee_management_system.employee;"
  );
  const employeeChoices = allEmployees.map((employee) => {
    return `${employee.first_name} ${employee.last_name}`;
  });

  const allRoles = await db.query("SELECT role.id, title FROM role");
  const roleChoices = allRoles.map((role) => {
    return role.title;
  });

  const roleUpdateQuestion = [
    {
      type: "list",
      name: "employeeChoice",
      choices: employeeChoices,
      message: "Select the employee whose role you would like to update:",
    },
    {
      type: "list",
      name: "roleChoice",
      choices: roleChoices,
      message: "Select the new role of the employee:",
    },
  ];

  const toUpdateEmployee = await inquirer.prompt(roleUpdateQuestion);
  const filteredEmployees = allEmployees.filter((employee) => {
    if (
      `${employee.first_name} ${employee.last_name}` ===
      toUpdateEmployee.employeeChoice
    ) {
      return true;
    }
  });
  const filteredRole = allRoles.filter((role) => {
    if (role.title === toUpdateEmployee.roleChoice) {
      return true;
    }
  });

  await db.parameterisedQuery(
    "UPDATE `employee_management_system`.`employee` SET `role_id` = ? WHERE (`id` = ?);",
    [filteredRole[0].id, filteredEmployees[0].id]
  );
};

// Function to update the selected employee's manager
const updateEmployeeManager = async () => {
  const allEmployees = await db.query(
    "SELECT employee.id, first_name, last_name FROM employee_management_system.employee;"
  );
  const employeeChoices = allEmployees.map((employee) => {
    return `${employee.first_name} ${employee.last_name}`;
  });

  const employeeNameQuestion = [
    {
      type: "list",
      name: "employeeChoice",
      choices: employeeChoices,
      message: "Select the employee whose manager you would like to update:",
    },
  ];
  const managerNameQuestion = [
    {
      type: "list",
      name: "managerChoice",
      choices: employeeChoices,
      message: "Select the employee's new manager:",
    },
  ];

  const whichEmployee = await inquirer.prompt(employeeNameQuestion);
  const newManager = await inquirer.prompt(managerNameQuestion);

  const filteredEmployee = allEmployees.filter((employee) => {
    if (
      `${employee.first_name} ${employee.last_name}` ===
      whichEmployee.employeeChoice
    ) {
      return true;
    }
  });
  const filteredManager = allEmployees.filter((employee) => {
    if (
      `${employee.first_name} ${employee.last_name}` ===
      newManager.managerChoice
    ) {
      return true;
    }
  });

  await db.parameterisedQuery(
    "UPDATE `employee_management_system`.`employee` SET `manager_id` = ? WHERE (`id` = ?);",
    [filteredManager[0].id, filteredEmployee[0].id]
  );
};

// Function to delete the selected department from the database
const deleteDepartment = async () => {
  const allDepartments = await db.query(
    "SELECT name FROM employee_management_system.department;"
  );
  const departmentChoices = allDepartments.map((department) => {
    return department.name;
  });

  const departmentQuestion = [
    {
      type: "list",
      name: "departmentChoice",
      choices: departmentChoices,
      message: "Select the department you would like to delete:",
    },
  ];

  const whichDepartment = await inquirer.prompt(departmentQuestion);

  await db.parameterisedQuery("DELETE FROM department WHERE name = ?;", [
    whichDepartment.departmentChoice,
  ]);
};

// Function to delete the selected role from the database
const deleteRole = async () => {
  const allRoles = await db.query(
    "SELECT title FROM employee_management_system.role;"
  );
  const roleChoices = allRoles.map((role) => {
    return role.title;
  });

  const roleQuestion = [
    {
      type: "list",
      name: "roleChoice",
      choices: roleChoices,
      message: "Select the role you would like to delete:",
    },
  ];

  const whichRole = await inquirer.prompt(roleQuestion);

  await db.parameterisedQuery("DELETE FROM role WHERE title = ?;", [
    whichRole.roleChoice,
  ]);
};

// Function to delete the selected employee from the database
const deleteEmployee = async () => {
  const allEmployees = await db.query(
    "SELECT id, first_name, last_name FROM employee_management_system.employee;"
  );
  const employeeChoices = allEmployees.map((employee) => {
    return `${employee.first_name} ${employee.last_name}`;
  });

  const employeeQuestion = [
    {
      type: "list",
      name: "employeeChoice",
      choices: employeeChoices,
      message: "Select the employee you would like to delete:",
    },
  ];

  const whichEmployee = await inquirer.prompt(employeeQuestion);

  const filteredEmployee = allEmployees.filter((employee) => {
    if (
      `${employee.first_name} ${employee.last_name}` ===
      whichEmployee.employeeChoice
    ) {
      return true;
    }
  });

  await db.parameterisedQuery("DELETE FROM employee WHERE id = ?;", [
    filteredEmployee[0].id,
  ]);
};

// Function to render the main menu onto the console
const mainMenu = async () => {
  const menuQuestions = [
    {
      type: "list",
      name: "menuChoices",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "View employees by manager",
        "Add new department",
        "Add new role",
        "Add new employee",
        "Update employee role",
        "Update employee manager",
        "Delete department",
        "Delete role",
        "Delete employee",
        "Exit",
      ],
      message: "Please, select what would you like to do:",
    },
  ];

  let inProgress = true;

  while (inProgress) {
    const menuOption = await inquirer.prompt(menuQuestions);
    if (menuOption.menuChoices === "Exit") {
      inProgress = false;
    } else if (menuOption.menuChoices === "View all departments") {
      viewDepartments();
    } else if (menuOption.menuChoices === "View all roles") {
      viewRoles();
    } else if (menuOption.menuChoices === "View all employees") {
      viewEmployees();
    } else if (menuOption.menuChoices === "View employees by manager") {
      viewEmployeesByManager();
    } else if (menuOption.menuChoices === "Add new department") {
      await addDepartment();
    } else if (menuOption.menuChoices === "Add new role") {
      await addRole();
    } else if (menuOption.menuChoices === "Add new employee") {
      await addEmployee();
    } else if (menuOption.menuChoices === "Update employee role") {
      await updateEmployeeRole();
    } else if (menuOption.menuChoices === "Update employee manager") {
      await updateEmployeeManager();
    } else if (menuOption.menuChoices === "Delete department") {
      await deleteDepartment();
    } else if (menuOption.menuChoices === "Delete role") {
      await deleteRole();
    } else if (menuOption.menuChoices === "Delete employee") {
      await deleteEmployee();
    }
  }
};

// Function that initialises and executes the application
const init = async () => {
  await db.start();
  await mainMenu();
  await db.end();
  console.log(
    "Thank you for using our programme. Press 'control+C' to exit mySQL in your terminal"
  );
};

init();