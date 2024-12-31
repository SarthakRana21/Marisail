import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// const ENVIRONMENT = process.env;

const connection = mysql.createPool({
  host: "",
  user: "",
  password: "",
  database: "",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


export default connection;
