import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import CampaignCreationForm from './CampaignCreationForm';
import './AdminDashboard.css';

const AdminDashboard = ({ appTitle, setAppTitle }) => {
  const [titleInput, setTitleInput] = useState(appTitle);
  const [campaigns, setCampaigns] = useState([]);
  const [filter, setFilter] = useState('');

  const fetchCampaigns = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/campaigns`);
      setCampaigns(data);
    } catch (error) {
      toast.error('Failed to load campaigns');
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (titleInput.trim() === '') {
      toast.error('Title cannot be empty');
      return;
    }
    setAppTitle(titleInput);
    localStorage.setItem('appTitle', titleInput);
    toast.success('App title updated successfully!');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${import.meta.env.VITE_API_URL}/campaigns/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Campaign deleted successfully');
      fetchCampaigns();
    } catch (error) {
      toast.error('Failed to delete campaign');
    }
  };

  const filteredCampaigns = campaigns.filter(c => 
    c.title.toLowerCase().includes(filter.toLowerCase()) || 
    c.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      
      <div className="admin-section card-glass">
        <h3>App Settings</h3>
        <form onSubmit={handleTitleSubmit} className="title-form">
          <div className="input-group">
            <label>Application Title:</label>
            <input 
              type="text" 
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="Enter new app title"
            />
          </div>
          <button type="submit" className="btn-primary">Save Settings</button>
        </form>
      </div>

      <div className="admin-section card-glass">
        <h3>Create Campaign</h3>
        <CampaignCreationForm fetchCampaigns={() => {
            toast.success('Campaign created successfully!');
            fetchCampaigns();
        }} />
      </div>

      <div className="admin-section card-glass">
        <h3>Manage Campaigns</h3>
        <input 
          type="text" 
          placeholder="Search by title or description..." 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
          style={{ padding: '0.8rem', width: '100%', marginBottom: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(15, 23, 42, 0.6)', color: '#fff', outline: 'none' }}
        />
        <div className="campaign-list-admin" style={{maxHeight: '400px', overflowY: 'auto'}}>
          {filteredCampaigns.map(c => (
             <div key={c._id} className="admin-campaign-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)'}}>
               <div style={{textAlign: 'left'}}>
                 <h4 style={{marginBottom: '0.3rem', color: 'var(--text-main)'}}>{c.title}</h4>
                 <p style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Raised: ₦{c.currentAmount} / ₦{c.goalAmount}</p>
               </div>
               <button onClick={() => handleDelete(c._id)} style={{background: 'var(--error-color)', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'}}>Delete</button>
             </div>
          ))}
          {filteredCampaigns.length === 0 && <p style={{color: 'var(--text-muted)'}}>No campaigns found.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
