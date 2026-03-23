import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './DonationForm.css';

const DonationForm = () => {
  const { id } = useParams();
  const history = useHistory();
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!amount || !email || !senderName) {
      toast.error('Please fill out all fields.');
      return;
    }

    try {
      setIsProcessing(true);
      const amountInKobo = Math.round(amount * 100);

      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: email,
        name: senderName,
        amount: amountInKobo,
        onClose: function() {
          setIsProcessing(false);
          toast('Payment abandoned', { icon: 'ℹ️', style: { border: '1px solid #475569'} });
        },
        callback: function(response) {
          toast.success('Payment authorized via Paystack!');
          axios.post(`${import.meta.env.VITE_API_URL}/increment/${id}`, {
            amount: parseFloat(amount),
          })
          .then(() => {
            toast.success('Donation successful! Redirecting...', {
              duration: 3000,
            });
            setTimeout(() => history.push('/'), 3000);
          })
          .catch((error) => {
            toast.error(`Error updating amount: ${error.message}`);
          })
          .finally(() => {
            setIsProcessing(false);
          });
        },
      });

      handler.openIframe();
    } catch (error) {
      setIsProcessing(false);
      toast.error(`Payment error: ${error.message}`);
    }
  };

  return (
    <div className="donation-wrapper">
      <div className="donation-form card-glass">
        <h2>Support Now</h2>
        <p className="subtitle">Every little bit counts. Make someone's day today.</p>

        <div className='donation-input-box'>
          <div className="input-field">
            <label>Donation Amount (NGN)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="E.g., 5000"
              min="100"
            />
          </div>
          
          <div className="input-field">
            <label>Name</label>
            <input
              type="text"
              placeholder="Your Full Name"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
            />
          </div>

          <div className="input-field">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button 
            className={`btn-primary donate-btn ${isProcessing ? 'processing' : ''}`} 
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing Payment...' : 'Securely Donate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;
