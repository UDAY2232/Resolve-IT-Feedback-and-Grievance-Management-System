import express from "express";
import pool from "../Service.js";

const router = express.Router();

// ✅ Get complaint status + timeline
router.get("/:id", async (req, res) => {
  const complaintId = parseInt(req.params.id, 10);
  if (isNaN(complaintId)) {
    return res.status(400).json({ message: "Invalid complaint ID" });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Complaint details
    const [complaintRows] = await connection.query(
      `SELECT id, user_id, category, subject, description, urgency, status, created_at 
       FROM Complaints 
       WHERE id = ?`,
      [complaintId]
    );

    if (complaintRows.length === 0) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const complaint = complaintRows[0];

    // Timeline
    const [timelineRows] = await connection.query(
      `SELECT status, comment, updated_at 
       FROM StatusLogs 
       WHERE complaint_id = ? 
       ORDER BY updated_at ASC`,
      [complaintId]
    );

    res.json({
      complaint_code: complaint.id,
      category: complaint.category,
      subject: complaint.subject,
      description: complaint.description,
      urgency: complaint.urgency,
      status: complaint.status,
      created_at: complaint.created_at,
      timeline: timelineRows || [],
    });

  } catch (err) {
    console.error("❌ Error fetching complaint status:", err);
    res.status(500).json({ message: "Error fetching complaint status" });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
