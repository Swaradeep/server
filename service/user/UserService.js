// Hanldes user table related operations

const pool = require("../db");

const getUserByEmailAndPassword = async (email, password) => {
  // Get the user details from DB based on email
  const user = await pool.query(
    "SELECT * FROM public.user WHERE email = $1 AND password = $2",
    [email, password]
  );
  return user.rows[0];
};

const getUserByEmail = async (email) => {
  // Get the user details from DB based on email
  const user = await pool.query("SELECT * FROM public.user WHERE email = $1", [
    email,
  ]);
  return user.rows[0];
};

const createUser = async ({ email, password }) => {
  // Insert the user details into the DB
  const user = await pool.query(
    "INSERT INTO public.user (email, password, username, last_login, last_password_change) VALUES ($1, $2, $1, $3, $3) RETURNING *",
    [email, password, new Date()]
  );
  return user.rows[0];
};

const getConnectionsByUserEmail = async (email) => {
  // Get the connections of the user from DB based on email from connections table joining the user table to get the details
  const connections = await pool.query(
    "SELECT * FROM  public.user LEFT OUTER JOIN public.connections c ON c.con_email = public.user.email WHERE c.user_email = $1",
    [email]
  );
  return connections.rows;
};

const getRecomendedConnections = async (email) => {
  const connections = await pool.query(
    "SELECT * FROM public.user WHERE email != $1 LIMIT 10",
    [email]
  );
  return connections.rows;
};

const addConnection = async (email, connectionEmail) => {
  // Add the connection to the connections table
  const connection = await pool.query(
    "INSERT INTO public.connections (user_email, con_email) VALUES ($1, $2) RETURNING *",
    [email, connectionEmail]
  );
  return connection.rows[0];
};

module.exports = {
  getUserByEmailAndPassword,
  getUserByEmail,
  createUser,
  getConnectionsByUserEmail,
  getRecomendedConnections,
  addConnection,
};
