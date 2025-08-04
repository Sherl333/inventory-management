import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { CSVLink } from 'react-csv';
import DashboardNavbar from "../components/DashboardNavbar";


const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState("");
  const [filterActivity, setFilterActivity] = useState("");
  const csvLink = useRef(); // Create a ref


  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/inventory/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        setData(res.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const filteredActivities = data?.recentActivities?.filter((act) => {
    return (
      act.name.toLowerCase().includes(filterUser.toLowerCase()) &&
      act.user_activities.toLowerCase().includes(filterActivity.toLowerCase())
    );
  }) || [];

  const handleExportCSV = () => {
    data?.recentActivities?.map((act) => ({
      User: act.name,
      Activity: act.user_activities,
      LastUpdated: new Date(act.last_updated).toLocaleString(),
    })) || [];

    if (csvLink.current) { // Ensure csvLink is not null or undefined
    csvLink.current.link.click();
  }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="Dashboard">
      <DashboardNavbar />
      <h2>Dashboard</h2>
      <h3>Welcome, {data?.user?.name}</h3>
      <div className="summary-cards">
        <div className="card">Total Products: {data?.totalProducts}</div>
        <div className="card">
          Total totalSKUsInInventory: {data?.totalSKUsInInventory}
        </div>
        <div className="card">Total Quantity: {data?.totalQuantity}</div>
        <div className="card">Total Warehouses: {data?.totalWarehouses}</div>
        <div className="card">
          Total activity count for today: {data?.activitiesToday}
        </div>
        <div className="recent-activities">
          <h3>Recent Activities</h3>
          <div className="filters mb-2">
            <input type="text" value={filterUser} placeholder="Filter by User" onChange={(e)=>setFilterUser(e.target.value)}/>
            <input type="text" value={filterActivity} placeholder="Filter by Activity" onChange={(e)=>setFilterActivity(e.target.value)}/>

          </div>
          {filteredActivities.length > 0 ? (
            <ul>
              {filteredActivities.map((act, idx) => (
                <li key={idx}>
                  <strong>{act.name}</strong>: {act.user_activities} <br />
                  <small>{new Date(act.last_updated).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No matching activities.</p>
          )}
        </div>

      </div>
      <h4>Export recent activity:</h4>
      <button onClick={handleExportCSV}>Export CSV</button> 
      <CSVLink
      data={data?.recentActivities?.map((act) => ({ // Ensure data is mapped as expected
        User: act.name,
        Activity: act.user_activities,
        LastUpdated: new Date(act.last_updated).toLocaleString(),
      })) || []}
      filename={"recent_activities.csv"}
      className="hidden" // Apply hidden styling
      ref={csvLink} // Assign the ref
      target="_blank"
    />   
    </div>
  );
};

export default Dashboard;
