const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

exports.findAllUsers = async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
};

exports.findUserById = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  if (result.rows.length === 0) {
    return res.status(404).send("User not found");
  }
  res.json(result.rows[0]);
};

exports.createUser = async (req, res) => {
  const { firstName, lastName, password } = req.body;
  const result = await pool.query(
    "INSERT INTO users (firstName, lastName, password) VALUES ($1, $2, $3) RETURNING *",
    [firstName, lastName, password]
  );
  res.status(201).json(result.rows[0]);
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, password } = req.body;
  const result = await pool.query(
    "UPDATE users SET firstName = $1, lastName = $2, password = $3 WHERE id = $4 RETURNING *",
    [firstName, lastName, password, id]
  );
  res.json(result.rows[0]);
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
  res.send(`User ${id} deleted`);
};
