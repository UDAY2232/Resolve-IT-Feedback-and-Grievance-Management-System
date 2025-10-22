import express from "express";
import pool from "../Service.js";
import multer from "multer";

const router = express.Router();

// 🔹 Multer setup (store files in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Submit Complaint API (with optional file upload)
router.post("/", upload.array("files"), async (req, res) => {
  let { user_id, is_anonymous, category, subject, description, urgency } = req.body;
  const files = req.files; // uploaded files

  // 🔹 Ensure is_anonymous is stored as 0 or 1
  is_anonymous = is_anonymous === "1" || is_anonymous === 1 ? 1 : 0;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1️⃣ Insert complaint
    const [result] = await connection.query(
      `INSERT INTO Complaints (user_id, is_anonymous, category, subject, description, urgency)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, is_anonymous, category, subject, description, urgency]
    );

    const complaintId = result.insertId;

    // 2️⃣ Insert media files (if any)
    if (files && files.length > 0) {
      for (const file of files) {
        await connection.query(
          `INSERT INTO MediaUploads (complaint_id, file_name, file_type, file_data)
           VALUES (?, ?, ?, ?)`,
          [complaintId, file.originalname, file.mimetype, file.buffer]
        );
      }
    }


    // 3️⃣ Insert initial status log (status = "Submitted")
    await connection.query(
      `INSERT INTO statuslogs (complaint_id, status, comment, updated_by)
       VALUES (?, ?, ?, ?)`,
       [complaintId, "Submitted", "Your Complaint has been successfully submitted and is awaiting review. You will receive an update once the review process begins.", user_id]
    );


    await connection.commit();
    res.json({ message: "Complaint submitted successfully!", complaintId });

  } catch (err) {
    await connection.rollback();
    console.error("❌ Complaint submission failed:", err);
    res.status(500).json({ message: "Complaint submission failed!", error: err.message });
  } finally {
    connection.release();
  }
});

export default router;
