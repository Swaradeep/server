// This is to connect to the postgres database
const { Pool } = require("pg");
const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "postgres",
  user: "admin",
  password: "admin",
});

module.exports = pool;
