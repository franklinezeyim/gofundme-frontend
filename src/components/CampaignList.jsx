import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './CampaignList.css';

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const isAdmin = !!localStorage.getItem('adminToken');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/campaigns`);
      setCampaigns(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this campaign from the home page?')) return;
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

  return (
    <div className="campaign-list animation-fade-in">
      {isLoading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Loading amazing campaigns...</p>
        </div>
      ) : (
        <div className="campaigns-grid">
          {campaigns.length === 0 ? (
            <p className="no-campaigns">No campaigns found. Check back later!</p>
          ) : (
            campaigns.map((campaign) => (
              <div className="campaign-card card-glass" key={campaign._id} style={{position: 'relative'}}>
                {isAdmin && (
                  <button 
                    onClick={() => handleDelete(campaign._id)} 
                    style={{position: 'absolute', top: '10px', right: '10px', background: 'var(--error-color)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}
                    title="Delete Campaign"
                  >
                    X
                  </button>
                )}
                <h3 style={isAdmin ? {paddingRight: '30px'} : {}}>{campaign.title}</h3>
                <p className="campaign-desc">{campaign.description}</p>
                <div className='campaign-price-box'>
                  <div className="price-item">
                    <span className="price-label">Goal</span>
                    <span className="price-value">₦{campaign.goalAmount.toLocaleString()}</span>
                  </div>
                  <div className="price-divider"></div>
                  <div className="price-item">
                    <span className="price-label">Raised</span>
                    <span className="price-value text-success">₦{campaign.currentAmount.toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100)}%`}}
                  ></div>
                </div>

                <Link to={`/donate/${campaign._id}`} className="btn-donate">Donate Now</Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CampaignList;
