const mysql = require("mysql");

class DB {
  constructor(database) {
    const databaseOptions = {
      host: "localhost",
      user: "root",
      password: "password",
      port: 3306,
      database,
    };

    this.database = database;
    this.connection = mysql.createConnection(databaseOptions);
  }

  // A method to connect to the mySQL server
  start() {
    return new Promise((resolve, reject) => {
      const onConnect = (err) => {
        if (err) reject(err);
        console.log(
          `Connection to ${this.database} was successful with id ${this.connection.threadId}`
        );
        resolve();
      };

      this.connection.connect(onConnect);
    });
  }

  // A method to disconnect from the mySQL server
  end(message) {
    this.connection.end();
    console.log(
      message || `Connection to ${this.database} has been successfully closed.`
    );
  }

  // A method that takes a mySQL query as an arguments and executes it in the database
  query(sqlQuery) {
    return new Promise((resolve, reject) => {
      const handleQuery = (err, rows) => {
        if (err) {
          reject(err);
        }

        resolve(rows);
      };

      this.connection.query(sqlQuery, handleQuery);
    });
  }

  // A method that takes a parameterised mySQL query as an argument with the parameters as an array and a boolean that when defined true console logs the inputted query
  parameterisedQuery(sqlQuery, args, info = false) {
    return new Promise((resolve, reject) => {
      const handleQuery = (err, rows) => {
        if (err) {
          reject(err);
        }

        resolve(rows);
      };

      const query = this.connection.query(sqlQuery, args, handleQuery);

      if (info) {
        console.log(query.sql);
      }
    });
  }
}

module.exports = DB;