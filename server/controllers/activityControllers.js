import express from 'express';
import { Parser } from 'json2csv';

export const getActivity = (req, res) => {
  const params =[]
  const {name, startDate,page = 1, limit = 10} = req.query;
  const offset = (page - 1) * limit;

  if(req.user.role != admin ){
    params.push(req.user.id)
  }
  const query = 'SELECT * FROM user_activities';
  if (params.length > 0) {
    query += ' WHERE user_id = ?';
  }
  // User name filter
  if (name) {
    query += " AND name LIKE ?";
    params.push(`%${user_name}%`);
  }

  // Start date filter
  if (startDate) {
    query += " AND created_at >= ?";
    params.push(startDate);
  }

  const countQuery = `SELECT COUNT(*) AS total FROM (${query}) AS sub`;
  db.query(countQuery, params, (err, countResult) => {
    if (err) {
      console.error("Error counting activities:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Add sorting and pagination
    query += " ORDER BY entered_timestamp DESC LIMIT ? OFFSET ?";
    db.query(query, [...params, parseInt(limit), parseInt(offset)], (err, results) => {
      if (err) {
        console.error("Error fetching paginated activities:", err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      res.status(200).json({
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        activities: results,
      });
    })
  })
}


export const exportActivitiesCSV = (req, res) => {
  let query = "SELECT * FROM user_activities WHERE 1=1";
  const params = [];

  const { name, user_activities, start_date, end_date } = req.query;

  if (req.user.role !== "admin") {
    query += " AND user_id = ?";
    params.push(req.user.id);
  }

  if (user_name) {
    query += " AND user_name LIKE ?";
    params.push(`%${name}%`);
  }

  if (activity) {
    query += " AND activity LIKE ?";
    params.push(`%${user_activities}%`);
  }

  if (start_date) {
    query += " AND DATE(last_updated) >= ?";
    params.push(start_date);
  }

  if (end_date) {
    query += " AND DATE(last_updated) <= ?";
    params.push(end_date);
  }

  query += " ORDER BY last_updated DESC";

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error exporting activities:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const fields = ["user_id", "name", "user_activities", "last_updated"];
    const parser = new Parser({ fields });
    const csv = parser.parse(results);

    res.header("Content-Type", "text/csv");
    res.attachment("activity_logs.csv");
    return res.send(csv);
  });
};
