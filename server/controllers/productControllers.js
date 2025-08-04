import express from "express";
import db from "../config/db.js";
export const getProducts = (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json({ products: results });
  });
};

export const insertProduct = (req, res) => {
  if (req.user.role != "admin") {
    return res
      .status(403)
      .json({
        error: "Forbidden: You do not have permission to add products.",
      });
  }
  const { sku, name, category, price } = req.body;
  if (!sku || !name || !category || typeof price === "undefined") {
    return res.status(400).json({ message: "All fields are required" });
  }
  const query =
    "INSERT INTO products (sku, name, category, price, created_at) VALUES (?, ?, ?, ?, NOW())";
  db.query(query, [sku, name, category, price], (error, results) => {
    if (error) {
      console.error("Error inserting product:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    // Log the user activity
    const activityQuery = `
      INSERT INTO user_activities (user_id, name, user_activities)
      VALUES (?, ?, ?)`;
    const activityDesc = `Added product: ${name} (SKU: ${sku})`;
    db.query(
      activityQuery,
      [req.user.id, req.user.name, activityDesc],
      (activityErr) => {
        if (activityErr) {
          console.error("Error logging activity:", activityErr);
          // Don't block product insertion just because logging failed
        }
      }
    );
    res.status(201).json({ message: "Product added successfully" });
  });
};

export const updateProduct = (req, res) => {
  if (req.user.role != "admin") {
    return res
      .status(403)
      .json({
        error: "Forbidden: You do not have permission to update products.",
      });
  }
  const { sku, name, category, price } = req.body;
  const { id } = req.params;
  if (!sku || !name || !category || typeof price === "undefined") {
    return res.status(400).json({ message: "All fields are required" });
  }
  const query =
    "UPDATE products SET name = ?, category = ?, price = ?, created_at = NOW() WHERE id = ?";
  db.query(query, [name, category, price, id], (error, results) => {
    if (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    // Log the user activity
    const activityQuery = `
      INSERT INTO user_activities (user_id, name, user_activities)
      VALUES (?, ?, ?)`;
    const activityDesc = `Updated product: ${name} (SKU: ${sku})`;
    db.query(
      activityQuery,
      [req.user.id, req.user.name, activityDesc],
      (activityErr) => {
        if (activityErr) {
          console.error("Error logging activity:", activityErr);
          // Don't block product update just because logging failed
        }
      }
    );
    res.status(200).json({ message: "Product updated successfully" });
  });
};

export const deleteProduct = (req, res) => {
  if (req.user.role != "admin") {
    return res
      .status(403)
      .json({
        error: "Forbidden: You do not have permission to delete products.",
      });
  }
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }
  const query = "DELETE FROM products WHERE id = ?";
  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error deleting product:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    // Log the user activity
    const activityQuery = `
      INSERT INTO user_activities (user_id, name, user_activities)
      VALUES (?, ?, ?)`;
    const activityDesc = `Deleted product with id: ${id}`;
    db.query(
      activityQuery,
      [req.user.id, req.user.name, activityDesc],
      (activityErr) => {
        if (activityErr) {
          console.error("Error logging activity:", activityErr);
          // Don't block product deletion just because logging failed
        }
      }
    );
    res.status(200).json({ message: "Product deleted successfully" });
  });
};
