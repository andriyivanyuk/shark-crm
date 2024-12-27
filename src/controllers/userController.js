const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class userController {
  async createUser(req, res) {
    const { name, surname, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    try {
      const newUser = await db.query(
        "INSERT INTO users (name, surname, password, email) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, surname, hashedPassword, email]
      );
      res.json(newUser.rows[0]);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async loginUser(req, res) {
    const { email, password } = req.body;
    try {
      const user = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      if (user.rows.length > 0) {
        const validPassword = await bcrypt.compare(
          password,
          user.rows[0].password
        );
        if (!validPassword) {
          return res.status(400).json({ message: "Invalid Credentials" });
        }
        const token = jwt.sign(
          { id: user.rows[0].id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.json({ token });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await db.query(
        "SELECT id, name, surname, email FROM users"
      );
      res.json(users.rows);
    } catch (error) {
      console.error("Error retrieving users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getOneUser(req, res) {
    const { id } = req.params;
    try {
      const user = await db.query(
        "SELECT id, name, surname, email FROM users WHERE id = $1",
        [id]
      );
      res.json(user.rows[0]);
    } catch (error) {
      console.error("Error retrieving user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateUser(req, res) {
    const { id, name, surname, email } = req.body;
    try {
      const user = await db.query(
        "UPDATE users SET name = $1, surname = $2, email = $4 WHERE id = $3 RETURNING *",
        [name, surname, id, email]
      );
      res.json(user.rows[0]);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteUser(req, res) {
    const { id } = req.params;
    try {
      const result = await db.query("DELETE FROM users WHERE id = $1", [id]);
      if (result.rowCount > 0) {
        res.json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new userController();
