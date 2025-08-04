import bcrypt from "bcryptjs";
import db from "../config/db.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const checkUserQuery = "SELECT * FROM users WHERE email = ?";

    db.query(checkUserQuery, [email], async (error, results) => {
      if (error) {
        console.error("Error checking user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      // ✅ Only proceed if user doesn't exist
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertQuery =
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

      db.query(
        insertQuery,
        [name, email, hashedPassword, role || "user"],
        (error, results) => {
          if (error) {
            console.error("Error inserting user:", error);
            return res.status(500).json({ message: "Internal Server Error" });
          }

          res.status(201).json({
            message: "User registered successfully",
            userId: results.insertId,
          });
        }
      );
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  console.log("Login route hit"); // ✅ Add this

  const { email, password } = req.body;
  if (!email || !password) {
    console.error("email and password are required");
    return res.status(400).json({ message: "email and password are required" });
  }
  const findUserQuery = "SELECT * FROM users WHERE email = ?";
  db.query(findUserQuery, [email], async (error, results) => {
    if (error) {
      console.error("Error finding user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Generate JWT token here (not implemented in this snippet)
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
};
