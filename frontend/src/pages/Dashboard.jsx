import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGroupDetails } from '../services/api';
import ExpenseList from '../components/ExpenseList';
import UploadCSV from '../components/UploadCSV';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Hardcoded default group ID for demonstration and initial setup
  const defaultGroupId = "group-123";

  useEffect(() => {
    // Validate user authentication via local storage token
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    // Fetch expense records asynchronously from the backend API
    const fetchExpenses = async () => {
      try {
        const response = await getGroupDetails(defaultGroupId);
        if (response.data && response.data.data) {
          setExpenses(response.data.data.expenses || []);
        }
      } catch (error) {
        console.error('Error fetching group data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [navigate]);

  // Callback to refresh the dashboard data after a successful CSV import
  const handleUploadSuccess = () => {
    window.location.reload();
  };

  // Securely terminate the user session
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Group Dashboard</h2>
        <button 
          onClick={handleLogout} 
          style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      {/* Integrate the CSV upload component */}
      <UploadCSV groupId={defaultGroupId} onUploadSuccess={handleUploadSuccess} />

      <hr style={{ margin: '20px 0' }} />

      {/* Conditionally render the data table or a loading indicator */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading expenses...</p>
      ) : (
        <ExpenseList expenses={expenses} />
      )}
    </div>
  );
}

export default Dashboard;