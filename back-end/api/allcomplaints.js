import express from "express";
import pool from "../Service.js"; // your database pool

const router = express.Router();

// ✅ GET /allcomplaints - fetch all complaints with media
router.get("/", async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.query(`
      SELECT 
        c.id,
        c.user_id,
        c.subject,
        c.description,
        c.status,
        c.created_at,
        c.is_anonymous,
        u.email AS userEmail
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
    `);

    // Fetch media for each complaint
    const complaints = await Promise.all(
      rows.map(async (row) => {
        const [mediaRows] = await connection.query(
          "SELECT media_id, file_name, file_type FROM mediauploads WHERE complaint_id = ?",
          [row.id]
        );

        return {
          id: row.id,
          subject: row.subject,
          description: row.description,
          status: row.status,
          created_at: row.created_at,
          user: row.is_anonymous ? "Anonymous" : row.userEmail,
          media: mediaRows || [],
        };
      })
    );

    connection.release();
    res.json(complaints);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to fetch complaints", error: err.message });
  }
});

// ✅ PUT /allcomplaints/:id/status - update complaint status & add to statuslogs
router.put("/:id/status", async (req, res) => {
  const complaintId = parseInt(req.params.id, 10);
  const { status, comment } = req.body;
  const updatedBy = 38; // replace with logged-in admin ID if available

  if (isNaN(complaintId)) {
    return res.status(400).json({ message: "Invalid complaint ID" });
  }

  // ✅ Determine final comment
  let finalComment = comment || "";
  if (status === "Under Review") {
    finalComment =
      "Complaint is currently under review by our team. We are investigating the issue and will provide an update within 3 business days.";
  } else if (!comment || comment.trim() === "") {
    // For Resolved/Rejected, comment is mandatory
    return res
      .status(400)
      .json({ message: "Comment is required for this action" });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Update complaint status
    await connection.query(
      "UPDATE complaints SET status = ? WHERE id = ?",
      [status, complaintId]
    );

    // Insert into statuslogs
    await connection.query(
      "INSERT INTO statuslogs (complaint_id, status, comment, updated_by) VALUES (?, ?, ?, ?)",
      [complaintId, status, finalComment, updatedBy]
    );

    connection.release();
    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error(err);
    if (connection) connection.release();
    res
      .status(500)
      .json({ message: "Failed to update status", error: err.message });
  }
});

// ✅ GET /allcomplaints/media/:media_id - serve media file
router.get("/media/:media_id", async (req, res) => {
  const mediaId = parseInt(req.params.media_id, 10);

  if (isNaN(mediaId)) return res.status(400).json({ message: "Invalid media ID" });

  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT file_name, file_type, file_data FROM mediauploads WHERE media_id = ?",
      [mediaId]
    );

    connection.release();

    if (rows.length === 0)
      return res.status(404).json({ message: "File not found" });

    const file = rows[0];
    res.setHeader("Content-Type", file.file_type);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${file.file_name}"`
    );
    res.send(file.file_data);
  } catch (err) {
    console.error(err);
    if (connection) connection.release();
    res.status(500).json({ message: "Failed to fetch media", error: err.message });
  }
});

export default router;
