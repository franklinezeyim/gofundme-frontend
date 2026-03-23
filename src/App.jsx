import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DonationForm from './components/DonationForm';
import CampaignList from './components/CampaignList';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import './App.css';

const PrivateRoute = ({ children, ...rest }) => {
  const token = localStorage.getItem('adminToken');
  return (
    <Route
      {...rest}
      render={({ location }) =>
        token ? (
          children
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: location } }} />
        )
      }
    />
  );
};

function App() {
  const [appTitle, setAppTitle] = useState('funder');

  useEffect(() => {
    const savedTitle = localStorage.getItem('appTitle');
    if (savedTitle) {
      setAppTitle(savedTitle);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/';
  };

  const isAdmin = !!localStorage.getItem('adminToken');

  return (
    <Router>
      <div className="App">
        <Toaster position="top-center" toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}/>
        <header className="App-header">
          <Link to='/' className='links'>
            <h1>{appTitle}</h1>
          </Link>
          <div className="header-actions">
            <Link to='/admin' className='admin-link'>Dashboard</Link>
            {isAdmin && <button onClick={handleLogout} className="logout-btn">Logout</button>}
          </div>
        </header>
        <main className="main-content">
          <Switch>
            <Route path="/" exact component={CampaignList} />
            <Route path="/donate/:id" component={DonationForm} />
            <Route path="/login" component={AdminLogin} />
            <PrivateRoute path="/admin">
              <AdminDashboard appTitle={appTitle} setAppTitle={setAppTitle} />
            </PrivateRoute>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
