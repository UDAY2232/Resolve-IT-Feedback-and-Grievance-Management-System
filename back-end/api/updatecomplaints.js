import express from "express";
import pool from "../Service.js";

const router = express.Router();

/**
 * POST /api/updatecomplaints/updatestatus
 * Updates complaint status (Under Review / Resolved / Rejected)
 * and inserts into statuslogs
 */
router.post("/updatestatus", async (req, res) => {
  const { complaintId, adminId, newStatus, comment } = req.body;

  if (!complaintId || !adminId || !newStatus) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // ✅ Update complaint status
    await connection.query(
      `UPDATE complaints SET status = ?, updated_at = NOW() WHERE id = ?`,
      [newStatus, complaintId]
    );

    // ✅ Add a log entry
    await connection.query(
      `INSERT INTO statuslogs (complaint_id, status, comment, updated_by)
       VALUES (?, ?, ?, ?)`,
      [complaintId, newStatus, comment || `${newStatus} by admin`, adminId]
    );

    await connection.commit();
    res.json({ success: true, message: `Complaint marked as ${newStatus}` });
  } catch (err) {
    console.error("❌ Error updating complaint:", err);
    if (connection) await connection.rollback();
    res.status(500).json({ success: false, message: "Error while updating complaint" });
  } finally {
    if (connection) connection.release();
  }
});

export default router;
