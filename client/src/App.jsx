import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import ProductsPage from "./pages/Products.jsx";
import InventoryPage from "./pages/Inventory.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />


      <Route
        path="/dashboard"
        element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
        }
      />

      <Route
          path="/products"
          element={
            <PrivateRoute>
              <ProductsPage />
            </PrivateRoute>
          }
        />
      <Route
        path="/inventory"
        element={
          <PrivateRoute>
            <InventoryPage />
          </PrivateRoute>
        }
      />  

      <Route path="*" element={<h1>404 Page Not Found</h1>} />

    </Routes>
  );
}

export default App;
