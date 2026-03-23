import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './CampaignCreationForm.css';

const CampaignCreationForm = ({ fetchCampaigns }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!title || !description || !goalAmount) {
      toast.error('All fields are required');
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/campaigns`, {
        title,
        description,
        goalAmount: parseFloat(goalAmount),
      });

      if (fetchCampaigns) {
        fetchCampaigns();
      }

      setTitle('');
      setDescription('');
      setGoalAmount('');
    } catch (error) {
      console.error(error);
      toast.error('Error creating campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="campaign-creation-form animation-fade-in">
      <form onSubmit={handleCreateCampaign} className="create-form">
        <div className="input-group">
          <label>Campaign Title</label>
          <input
            type="text"
            placeholder="Help build a school..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="input-group">
          <label>Story / Description</label>
          <textarea
            placeholder="Tell your story..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            rows="4"
          />
        </div>

        <div className="input-group">
          <label>Goal Amount (NGN)</label>
          <input
            type="number"
            placeholder="E.g., 500000"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            disabled={isSubmitting}
            min="100"
          />
        </div>

        <button 
          className="btn-primary create-btn" 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Launch Campaign'}
        </button>
      </form>
    </div>
  );
};

export default CampaignCreationForm;
