import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardNavbar from "../components/DashboardNavbar";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ sku: "", warehouse_id: "", quantity: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchInventory = async () => {
    try {
      const res = await axios.get("/api/inventory/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setInventory(res.data.inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      sku: item.sku,
      warehouse_id: item.warehouse_id,
      quantity: item.quantity,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/inventory/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchInventory();
    } catch (error) {
      console.error("Error deleting inventory item:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        sku: formData.sku,
        warehouse_id: formData.warehouse_id,
        quantity: parseInt(formData.quantity, 10),
      };

      await axios.post("/api/inventory/updateinventory", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setFormData({ sku: "", warehouse_id: "", quantity: "" });
      setEditingItem(null);
      fetchInventory();
    } catch (error) {
      console.error("Error saving inventory item:", error);
    }
  };

  const filteredInventory = inventory.filter((item) =>
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <DashboardNavbar />
      <h2>Inventory</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="SKU"
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Warehouse ID"
          value={formData.warehouse_id}
          onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          required
        />
        <button type="submit">{editingItem ? "Update" : "Add"} Item</button>
        {editingItem && (
          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setFormData({ sku: "", warehouse_id: "", quantity: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <input
        type="text"
        placeholder="Search by SKU"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "5px", width: "50%" }}
      />

      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Warehouse ID</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.length > 0 ? (
            filteredInventory.map((item) => (
              <tr key={item.id}>
                <td>{item.sku}</td>
                <td>{item.warehouse_id}</td>
                <td>{item.quantity}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>Edit</button>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No Inventory found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryPage;
