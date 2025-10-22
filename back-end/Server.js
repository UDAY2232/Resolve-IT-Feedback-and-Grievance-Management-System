import express from "express";
import cors from "cors";
import pool from "./Service.js";
import complaintsRouter from "./api/complaints.js";
import statusRoutes from "./api/status.js";
import allComplaintsRouter from "./api/allcomplaints.js";
import escalateRouter from "./api/escalate.js";
import updateComplaintsRouter from "./api/updatecomplaints.js";


const app = express();
app.use(cors());
app.use(express.json()); // To read JSON body


// ✅ Routes
app.use("/complaints", complaintsRouter);
app.use("/api/status", statusRoutes);
app.use("/api/allcomplaints", allComplaintsRouter);
app.use("/api/escalate", escalateRouter);

//app.use("/api/updatecomplaints", updateComplaintsRouter);



// ✅ Signup API
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );
    connection.release();
    res.json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    // Check for duplicate entry error (MySQL error code 1062)
    if (err.code === "ER_DUP_ENTRY") {
      res.status(400).json({ message: "Email already exists!" });
    } else {
      res.status(500).json({ message: "Signup failed! " + err.message });
    }
  }
});

// ✅ Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT id, name, email, role FROM users WHERE email = ? AND password = ?",
      [email, password]
    );
    connection.release();

    if (rows.length > 0) {
      res.json({
        success: true,
        message: "Login successful",
        user: rows[0],  // includes role now
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Login failed!" });
  }
});



app.listen(5000, () => console.log("✅ Server is running on port 5000"));

// ✅ DB test connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ DB connected successfully");
    connection.release();
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  }
})();
