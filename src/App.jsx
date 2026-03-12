import React, { useState, useEffect } from 'react';
import { LogOut, Home, Plus, BarChart3, Menu, X, Award, AlertCircle, Download, Target } from 'lucide-react';
import { supabase } from './supabaseClient';

const COLORS = { 
  primary: '#1f2937', secondary: '#3b82f6', accent: '#10b981', danger: '#ef4444', 
  warning: '#f59e0b', light: '#f3f4f6', text: '#111827', border: '#e5e7eb', 
  success: '#059669'
};

const KPI_LIBRARY = {
  HR: [
    { id: 'hr_1', name: 'Employee Satisfaction', unit: '%', target: 85, weight: 15 },
    { id: 'hr_2', name: 'Engagement Index', unit: 'score', target: 75, weight: 15 },
  ],
  Development: [
    { id: 'dev_1', name: 'Sprint Completion', unit: '%', target: 95, weight: 25 },
    { id: 'dev_2', name: 'Code Quality', unit: '%', target: 90, weight: 20 },
  ],
  Sales: [
    { id: 'sales_1', name: 'Revenue Growth', unit: '%', target: 25, weight: 30 },
    { id: 'sales_2', name: 'Lead Conversion', unit: '%', target: 30, weight: 25 },
  ],
};

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await supabase.from('users').select('*').eq('email', email).single();
      if (data) onLogin(data);
      else alert('Invalid credentials');
    } catch {
      alert('Login error');
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '50px', borderRadius: '12px', width: '100%', maxWidth: '420px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>PerfTrack Pro</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '30px' }}>Enterprise KPI System</p>
        <form onSubmit={handleLogin}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ width: '100%', padding: '12px', marginBottom: '12px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', boxSizing: 'border-box' }} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={{ width: '100%', padding: '12px', marginBottom: '24px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', padding: '12px', background: COLORS.secondary, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Sign In</button>
        </form>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '30px' }}>📊 Enterprise KPI Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <StatCard label="Total Employees" value="256" icon="👥" />
        <StatCard label="Active Goals" value="480" icon="🎯" />
        <StatCard label="Avg Performance" value="82%" icon="📈" />
        <StatCard label="KPIs Tracked" value="155+" icon="⭐" />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
      <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
        <span style={{ fontSize: '32px' }}>{icon}</span>
        <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: COLORS.secondary }}>{value}</p>
      </div>
    </div>
  );
}

function KPILibrary() {
  const [dept, setDept] = useState('HR');
  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>📚 KPI Library (155+ KPIs)</h2>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
        {Object.keys(KPI_LIBRARY).map(d => (
          <button key={d} onClick={() => setDept(d)} style={{ padding: '8px 16px', background: dept === d ? COLORS.secondary : COLORS.light, color: dept === d ? 'white' : COLORS.text, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>{d}</button>
        ))}
      </div>
      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
        <table style={{ width: '100%' }}>
          <thead>
            <tr style={{ background: COLORS.light }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>KPI Name</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Target</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Weight</th>
            </tr>
          </thead>
          <tbody>
            {KPI_LIBRARY[dept].map(kpi => (
              <tr key={kpi.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: '12px' }}>{kpi.name}</td>
                <td style={{ padding: '12px' }}>{kpi.target} {kpi.unit}</td>
                <td style={{ padding: '12px', fontWeight: '600', color: COLORS.secondary }}>{kpi.weight}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Analytics() {
  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>📊 Analytics</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Department Performance</h3>
          {['Sales: 88%', 'Dev: 85%', 'HR: 82%'].map((item, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                <strong>{item.split(':')[0]}</strong>
                <span>{item.split(':')[1]}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Key Insights</h3>
          <div style={{ fontSize: '13px', lineHeight: '1.8' }}>
            ✅ Sales outperforming by 6%<br/>
            ⚠️ Support needs improvement<br/>
            🎯 Company KPI hit: 82%
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isLoggedIn) {
    return <LoginPage onLogin={(user) => { setCurrentUser(user); setIsLoggedIn(true); }} />;
  }

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'kpi', name: 'KPI Library', icon: Target },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.light, fontFamily: "'Segoe UI'" }}>
      <div style={{ width: sidebarOpen ? '260px' : '0', background: COLORS.primary, color: 'white', padding: sidebarOpen ? '20px 0' : '0', transition: 'all 0.3s', overflow: 'hidden' }}>
        <h1 style={{ margin: sidebarOpen ? '0 20px 30px 20px' : '0', fontSize: '14px', fontWeight: '700' }}>PerfTrack Pro</h1>
        {modules.map(m => {
          const Icon = m.icon;
          return (
            <button key={m.id} onClick={() => setActiveModule(m.id)} style={{ width: '100%', padding: '12px 20px', background: activeModule === m.id ? COLORS.secondary : 'transparent', color: 'white', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: activeModule === m.id ? '600' : '500' }}>
              <Icon size={18} />
              {sidebarOpen && m.name}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'white', padding: '16px 24px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: COLORS.text }}>{sidebarOpen ? <X size={24} /> : <Menu size={24} />}</button>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>PerfTrack Pro</h1>
          <button onClick={() => { setIsLoggedIn(false); setCurrentUser(null); }} style={{ padding: '8px 16px', background: COLORS.danger, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}><LogOut size={16} />Logout</button>
        </div>

        <div style={{ flex: 1, overflow: 'auto' }}>
          {activeModule === 'dashboard' && <Dashboard />}
          {activeModule === 'kpi' && <KPILibrary />}
          {activeModule === 'analytics' && <Analytics />}
        </div>
      </div>
    </div>
  );
}