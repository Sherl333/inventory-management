import db from '../config/db.js';

export const getInventory = (req, res) => {
  const query = 'SELECT * FROM inventory';
  db.query(query,(error, results)=> {
    if (error) {
      console.error('Error fetching inventory:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json({inventory:results});
  })
}



export const updateInventory = (req, res) => {
  if(req.user.role != 'admin'){
    return res.status(403).json({ error: 'Forbidden: You do not have permission to update inventory.' });
  }
 const {sku,warehouse_id, quantity} = req.body;
 if (!sku || !warehouse_id || typeof quantity === "undefined") {
    return res.status(400).json({ message: "All fields are required" });
  }
  const query = 'INSERT INTO inventory (sku, warehouse_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)'
  db.query(query, [sku, warehouse_id, quantity], (error, results) => {
    if (error) {
      console.error('Error updating inventory:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // login the user activities
    const activityQuery = `
      INSERT INTO user_activities (user_id, name, user_activities)
      VALUES (?, ?, ?)`;
    const activityDesc = `Updated inventory for SKU: ${sku}, Warehouse ID: ${warehouse_id}`;

    db.query(
      activityQuery,
      [req.user.id, req.user.name, activityDesc],
      (activityErr) => {
        if (activityErr) {
          console.error("Error logging activity:", activityErr);
          // Don't block inventory update just because logging failed
        }
      }
    );
    res.status(200).json({ message: 'Inventory updated successfully' });
  });

  
}