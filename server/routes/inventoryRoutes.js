import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { getInventory,updateInventory } from "../controllers/inventoryControllers.js";
import db from '../config/db.js';

const router = express.Router();
router.get("/dashboard", verifyToken, async (req, res) => {
  try {
    const dashboardData = {};

    // Total products
    const [productCount] = await db.promise().query("SELECT COUNT(*) AS count FROM products");
    dashboardData.totalProducts = productCount[0].count;

    // Total inventory SKUs
    const [skuCount] = await db.promise().query("SELECT COUNT(DISTINCT sku) AS count FROM inventory");
    dashboardData.totalSKUsInInventory = skuCount[0].count;

    // Total inventory quantity
    const [quantitySum] = await db.promise().query("SELECT SUM(quantity) AS totalQuantity FROM inventory");
    dashboardData.totalQuantity = quantitySum[0].totalQuantity || 0;

    // Total warehouses
    const [warehouseCount] = await db.promise().query("SELECT COUNT(DISTINCT warehouse_id) AS count FROM inventory");
    dashboardData.totalWarehouses = warehouseCount[0].count;

    // Activities count for today
    const [activityToday] = await db.promise().query(`
      SELECT COUNT(*) AS count FROM user_activities
      WHERE DATE(last_updated) = CURDATE()
    `);
    dashboardData.activitiesToday = activityToday[0].count;

    // Latest 5 activity logs
    const [recentActivities] = await db.promise().query(`
      SELECT name, user_activities, last_updated
      FROM user_activities
      ORDER BY last_updated DESC
      LIMIT 5
    `);
    dashboardData.recentActivities = recentActivities;
    dashboardData.user = {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role,
    };

    res.json({ success: true, data: dashboardData });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get('/',verifyToken,getInventory)
router.post('/updateinventory', verifyToken, updateInventory);


export default router;
