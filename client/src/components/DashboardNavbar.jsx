import { Link, useNavigate } from "react-router-dom";

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="dashboard-navbar">
      <div className="space-x-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/products">Products</Link>
        <Link to="/inventory">Inventory</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
