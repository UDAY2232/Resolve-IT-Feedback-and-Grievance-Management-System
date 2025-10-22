import express from "express";
import pool from "../Service.js";

const router = express.Router();

// Helper: business days between two dates
function businessDaysBetween(startDate, endDate) {
  const d1 = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const d2 = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  let count = 0;
  let cur = new Date(d1);
  while (cur <= d2) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count - 1; // exclude updated_at day
}

// Auto-escalation function
async function autoEscalate() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT id, updated_at FROM complaints
      WHERE status IN ('Submitted', 'Under Review')
    `);

    const now = new Date();
    const toEscalate = rows.filter(r => businessDaysBetween(new Date(r.updated_at), now) >= 3);

    if (toEscalate.length === 0) return [];

    await connection.beginTransaction();

    // Update complaint status
    const ids = toEscalate.map(r => r.id);
    await connection.query(`UPDATE complaints SET status='Escalated', updated_at=NOW() WHERE id IN (?)`, [ids]);

    // Insert into escalations
    const escalateReason = "Auto-escalated after 3 business days without action";
    const escRows = toEscalate.map(r => [r.id, null, escalateReason, new Date()]);
    if (escRows.length > 0) {
      await connection.query(
        `INSERT INTO escalations (complaint_id, escalated_to, reason, escalated_at) VALUES ?`,
        [escRows]
      );
    }

    // Insert into statuslogs
    const logRows = toEscalate.map(r => [r.id, "Escalated", escalateReason, 0]); // 0 = system
    if (logRows.length > 0) {
      await connection.query(
        `INSERT INTO statuslogs (complaint_id, status, comment, updated_by) VALUES ?`,
        [logRows]
      );
    }

    await connection.commit();
    connection.release();
    return ids;
  } catch (err) {
    await connection.rollback();
    connection.release();
    throw err;
  }
}

// GET pending complaints (runs auto-escalation first)
router.get("/pending", async (req, res) => {
  try {
    await autoEscalate(); // auto-escalate if needed

    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT c.id, c.subject, c.status, u.email AS userEmail
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.status IN ('Submitted', 'Under Review')
      ORDER BY c.updated_at ASC
    `);
    connection.release();

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pending complaints" });
  }
});

// Manual escalation
router.post("/:id", async (req, res) => {
  const complaintId = parseInt(req.params.id, 10);
  const { escalated_to, reason, escalated_by } = req.body;

  if (!reason || reason.trim() === "") {
    return res.status(400).json({ message: "Escalation reason required" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Update complaint
    await connection.query(
      `UPDATE complaints SET status='Escalated', updated_at=NOW() WHERE id=?`,
      [complaintId]
    );

    // Insert escalation record
    await connection.query(
      `INSERT INTO escalations (complaint_id, escalated_to, reason, escalated_at) VALUES (?, ?, ?, NOW())`,
      [complaintId, escalated_to || null, reason]
    );

    // Insert statuslog
    await connection.query(
      `INSERT INTO statuslogs (complaint_id, status, comment, updated_by) VALUES (?, ?, ?, ?)`,
      [complaintId, "Escalated", reason, escalated_by || 0]
    );

    await connection.commit();
    connection.release();

    res.json({ message: "Complaint escalated successfully", complaint_id: complaintId });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error(err);
    res.status(500).json({ message: "Failed to escalate complaint" });
  }
});

// GET all escalated complaints
router.get("/", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT c.id, c.subject, c.status, e.escalated_to, e.reason, e.escalated_at
      FROM complaints c
      LEFT JOIN escalations e ON c.id = e.complaint_id
      WHERE c.status='Escalated'
      ORDER BY c.updated_at DESC
    `);
    connection.release();

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch escalated complaints" });
  }
});

export default router;
