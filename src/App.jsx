import React, { useState, useEffect } from 'react';
import { Users, Target, Menu, X, LogOut, Home, Plus } from 'lucide-react';
import { supabase } from './supabaseClient';

const COLORS = { primary: '#1f2937', secondary: '#3b82f6', accent: '#10b981', danger: '#ef4444', light: '#f3f4f6', text: '#111827', border: '#e5e7eb' };

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={{ width: '100vw', height: '100vh', background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>PerfTrack Pro</h1>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ width: '100%', padding: '10px', marginBottom: '10px', border: `1px solid ${COLORS.border}`, borderRadius: '4px', boxSizing: 'border-box' }} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ width: '100%', padding: '10px', marginBottom: '20px', border: `1px solid ${COLORS.border}`, borderRadius: '4px', boxSizing: 'border-box' }} />
        <button onClick={() => email && password && onLogin({ email, name: email.split('@')[0] })} style={{ width: '100%', padding: '10px', background: COLORS.secondary, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sign In</button>
      </div>
    </div>
  );
}

function Dashboard() {
  const [users, setUsers] = useState(0);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('users').select('*');
      setUsers(data?.length || 0);
    };
    load();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <h2>Dashboard</h2>
      <div style={{ marginTop: '20px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
          <p>Total Users: {users}</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState(null);

  if (!logged) {
    return <LoginPage onLogin={(u) => { setUser(u); setLogged(true); }} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: COLORS.light }}>
      <div style={{ background: 'white', padding: '15px 20px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>PerfTrack Pro</h1>
        <button onClick={() => setLogged(false)} style={{ padding: '8px 16px', background: COLORS.danger, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
      </div>
      <Dashboard />
    </div>
  );
}