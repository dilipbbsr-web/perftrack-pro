import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { supabase } from './supabaseClient';

const COLORS = { primary: '#1f2937', secondary: '#3b82f6', accent: '#10b981', danger: '#ef4444', light: '#f3f4f6', text: '#111827', border: '#e5e7eb' };

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin({ email, name: email.split('@')[0] });
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI'" }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: COLORS.text }}>PerfTrack Pro</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '30px' }}>Performance Management System</p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: COLORS.text }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: COLORS.text }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            style={{ width: '100%', padding: '12px', background: COLORS.secondary, color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
          >
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
          Demo: Use any email/password
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({ users: 0, employees: 0, kpis: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data: users } = await supabase.from('users').select('*');
        const { data: employees } = await supabase.from('employees').select('*');
        const { data: kpis } = await supabase.from('kpis').select('*');
        
        setStats({
          users: users?.length || 0,
          employees: employees?.length || 0,
          kpis: kpis?.length || 0
        });
      } catch (err) {
        console.error('Error loading stats:', err);
      }
    };
    loadStats();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', color: COLORS.text }}>Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
          <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>Total Users</p>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: COLORS.secondary }}>{stats.users}</p>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
          <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>Total Employees</p>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: COLORS.accent }}>{stats.employees}</p>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
          <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>Total KPIs</p>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: COLORS.warning }}>{stats.kpis}</p>
        </div>
      </div>

      <div style={{ marginTop: '40px', background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: '600', color: COLORS.text }}>Welcome to PerfTrack Pro</h3>
        <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
          This is your performance management system. The dashboard displays key statistics from your Supabase database.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: COLORS.light, fontFamily: "'Segoe UI'" }}>
      <div style={{ background: 'white', padding: '16px 24px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: COLORS.text }}>PerfTrack Pro</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', color: COLORS.text }}>Welcome, {currentUser?.name}!</span>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: COLORS.danger, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <Dashboard />
    </div>
  );
}
