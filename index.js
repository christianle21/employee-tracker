const DB = require("./src/db/DB");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const db = new DB("employees");

const viewDepartments = async () => {
  const allDepartments = await db.query(
    'SELECT department.id for "Department ID", the name for "Department Name", the title for "Role Title", the salary for "Salary" FROM department LEFT JOIN role ON role.department_id = department.id'
  );
  console.log("\n");
  console.table(allDepartments);
  console.log("\n");
  console.log("\n");
  console.log("Please press the up or down arrow to return to the main menu!");
};

const viewRoles = async () => {
  const allRoles = await db.query(
    'SELECT role.id for "Role ID", title for "Role Title", salary for "Salary", name for "Department" FROM role RIGHT JOIN department ON role.department_id = department.id'
  );
  console.log("\n");
  console.table(allRoles);
  console.log("\n");
  console.log("\n");
  console.log("Please press the up or down arrow to return to the main menu!");
};

const viewEmployees = async () => {
  const allEmployees = await db.query(
    'SELECT a.id for "Employee ID", a.first_name for "First Name", a.last_name for "Last Name", title for "Title", CONCAT(b.first_name," ",b.last_name) for "Manager\'s Name", name for "Department" FROM employee a LEFT JOIN employee b on a.manager_id = b.id LEFT JOIN role ON a.role_id = role.id LEFT JOIN department ON role.department_id = department.id'
  );
  console.log("\n");
  console.table(allEmployees);
  console.log("\n");
  console.log("\n");
  console.log("Please press the up or down arrow to return to the main menu!");
};

const viewEmployeesByManager = async () => {
  const allEmployees = await db.query(
    'SELECT a.id for "Manager ID", a.first_name for "First Name", a.last_name for "Last Name", title for "Title", CONCAT(b.first_name," ",b.last_name) for "Direct Report\'s Name", name for "Department" FROM employee a INNER JOIN employee b on b.manager_id = a.id LEFT JOIN role ON a.role_id = role.id LEFT JOIN department ON role.department_id = department.id'
  );
  console.log("\n");
  console.table(allEmployees);
  console.log("\n");
  console.log("\n");
  console.log("Please press the up or down arrow to return to the main menu!");
};

const addDepartment = async () => {
  const departmentQuestions = [
    {
      type: "input",
      name: "departmentName",
      message: "What do you want to name the new department?",
    },
  ];
  const newDepartment = await inquirer.prompt(departmentQuestions);
  await db.parameterisedQuery(
    "INSERT INTO `employees`.`department` (`name`) VALUES (?);",
    [newDepartment.departmentName]
  );
};

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
      message: "Please choose the title for the new role!",
    },
    {
      type: "input",
      name: "roleSalary",
      message: "Do you know what the salary will be?",
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
    "INSERT INTO `employees`.`role` (`title`, `salary`, `department_id`) VALUES (?, ?, ?);",
    [newRole.roleTitle, newRole.roleSalary, filteredDepartment[0].id]
  );
};

const addEmployee = async () => {
  const allRoles = await db.query("SELECT role.id, title FROM role");
  const roleChoices = allRoles.map((role) => {
    return role.title;
  });

  const employeeQuestions = [
    {
      type: "input",
      name: "firstName",
      message: "Please state the first name of the new employee.",
    },
    {
      type: "input",
      name: "lastName",
      message: "Please state the last name of the new employee.",
    },
    {
      type: "list",
      name: "roleChoice",
      choices: roleChoices,
      message: "Please choose the role for the new employee:",
    },
  ];

  const newEmployee = await inquirer.prompt(employeeQuestions);
  const filteredRole = allRoles.filter((role) => {
    if (role.title === newEmployee.roleChoice) {
      return true;
    }
  });

  await db.parameterisedQuery(
    "INSERT INTO `employees`.`employee` (`first_name`, `last_name`, `role_id`) VALUES (?, ?, ?);",
    [newEmployee.firstName, newEmployee.lastName, filteredRole[0].id]
  );

  const managerQuestion = [
    {
      type: "confirm",
      name: "hasManager",
      message: "Will the new employee have a manager?",
    },
  ];

  const isManager = await inquirer.prompt(managerQuestion);

  if (isManager.hasManager) {
    const allEmployees = await db.query(
      "SELECT employee.id, first_name, last_name FROM employees.employee;"
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
        message: "Please choose the new employee's manager:",
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
      "UPDATE `employees`.`employee` SET `manager_id` = ? WHERE (`id` = ?);",
      [filteredManager[0].id, allEmployees[employeeIndex].id]
    );
  }
};

const updateEmployeeRole = async () => {
  const allEmployees = await db.query(
    "SELECT employee.id, first_name, last_name FROM employees.employee;"
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
      message: "Please choose the employee whose role you would like to update:",
    },
    {
      type: "list",
      name: "roleChoice",
      choices: roleChoices,
      message: "Please choose the new role of the employee:",
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
    "UPDATE `employees`.`employee` SET `role_id` = ? WHERE (`id` = ?);",
    [filteredRole[0].id, filteredEmployees[0].id]
  );
};

const updateEmployeeManager = async () => {
  const allEmployees = await db.query(
    "SELECT employee.id, first_name, last_name FROM employees.employee;"
  );
  const employeeChoices = allEmployees.map((employee) => {
    return `${employee.first_name} ${employee.last_name}`;
  });

  const employeeNameQuestion = [
    {
      type: "list",
      name: "employeeChoice",
      choices: employeeChoices,
      message: "Please choose the employee whose manager you would like to update:",
    },
  ];
  const managerNameQuestion = [
    {
      type: "list",
      name: "managerChoice",
      choices: employeeChoices,
      message: "Please choose the employee's new manager:",
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
    "UPDATE `employees`.`employee` SET `manager_id` = ? WHERE (`id` = ?);",
    [filteredManager[0].id, filteredEmployee[0].id]
  );
};

const deleteDepartment = async () => {
  const allDepartments = await db.query(
    "SELECT name FROM employees.department;"
  );
  const departmentChoices = allDepartments.map((department) => {
    return department.name;
  });

  const departmentQuestion = [
    {
      type: "list",
      name: "departmentChoice",
      choices: departmentChoices,
      message: "Please choose the department you would like to delete:",
    },
  ];

  const whichDepartment = await inquirer.prompt(departmentQuestion);

  await db.parameterisedQuery("DELETE FROM department WHERE name = ?;", [
    whichDepartment.departmentChoice,
  ]);
};

const deleteRole = async () => {
  const allRoles = await db.query(
    "SELECT title FROM employees.role;"
  );
  const roleChoices = allRoles.map((role) => {
    return role.title;
  });

  const roleQuestion = [
    {
      type: "list",
      name: "roleChoice",
      choices: roleChoices,
      message: "Please pick the role you would like to delete:",
    },
  ];

  const whichRole = await inquirer.prompt(roleQuestion);

  await db.parameterisedQuery("DELETE FROM role WHERE title = ?;", [
    whichRole.roleChoice,
  ]);
};

const deleteEmployee = async () => {
  const allEmployees = await db.query(
    "SELECT id, first_name, last_name FROM employees.employee;"
  );
  const employeeChoices = allEmployees.map((employee) => {
    return `${employee.first_name} ${employee.last_name}`;
  });

  const employeeQuestion = [
    {
      type: "list",
      name: "employeeChoice",
      choices: employeeChoices,
      message: "Please pick the employee you would like to delete:",
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

const mainMenu = async () => {
  const menuQuestions = [
    {
      type: "list",
      name: "menuChoices",
      choices: [
        "View all the departments",
        "View all the roles",
        "View all the employees",
        "View employees sorted by manager",
        "Add a new department",
        "Add a new role",
        "Add a new employee",
        "Update an employee's role",
        "Update an employee's manager",
        "Delete a department",
        "Delete a role",
        "Delete an employee",
        "Exit",
      ],
      message: "What would you like to do now?",
    },
  ];

  let inProgress = true;

  while (inProgress) {
    const menuOption = await inquirer.prompt(menuQuestions);
    if (menuOption.menuChoices === "Exit") {
      inProgress = false;
    } else if (menuOption.menuChoices === "View all the departments") {
      viewDepartments();
    } else if (menuOption.menuChoices === "View all the roles") {
      viewRoles();
    } else if (menuOption.menuChoices === "View all the employees") {
      viewEmployees();
    } else if (menuOption.menuChoices === "View employees sroted by manager") {
      viewEmployeesByManager();
    } else if (menuOption.menuChoices === "Add a new department") {
      await addDepartment();
    } else if (menuOption.menuChoices === "Add a new role") {
      await addRole();
    } else if (menuOption.menuChoices === "Add a new employee") {
      await addEmployee();
    } else if (menuOption.menuChoices === "Update an employee's role") {
      await updateEmployeeRole();
    } else if (menuOption.menuChoices === "Update an employee's manager") {
      await updateEmployeeManager();
    } else if (menuOption.menuChoices === "Delete a department") {
      await deleteDepartment();
    } else if (menuOption.menuChoices === "Delete a role") {
      await deleteRole();
    } else if (menuOption.menuChoices === "Delete an employee") {
      await deleteEmployee();
    }
  }
};

const init = async () => {
  await db.start();
  await mainMenu();
  await db.end();
  console.log(
    "Thank you for using our programme. Please press 'control+C' to exit mySQL in your terminal!"
  );
};

init();