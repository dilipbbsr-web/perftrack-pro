import React, { useState } from 'react';
import { LogOut, Home, Target, BarChart3, Menu, X } from 'lucide-react';
import { supabase } from './supabaseClient';

const COLORS = { 
  primary: '#1f2937', secondary: '#3b82f6', accent: '#10b981', danger: '#ef4444', 
  warning: '#f59e0b', light: '#f3f4f6', text: '#111827', border: '#e5e7eb'
};

const KPI_LIBRARY = {
  HR: [
    { id: 'hr_1', name: 'Employee Satisfaction', unit: '%', target: 85, weight: 15 },
    { id: 'hr_2', name: 'Engagement Index', unit: 'score', target: 75, weight: 15 },
  ],
  Sales: [
    { id: 's_1', name: 'Revenue Growth', unit: '%', target: 25, weight: 30 },
    { id: 's_2', name: 'Lead Conversion', unit: '%', target: 30, weight: 25 },
  ],
  Development: [
    { id: 'd_1', name: 'Sprint Completion', unit: '%', target: 95, weight: 25 },
    { id: 'd_2', name: 'Code Quality', unit: '%', target: 90, weight: 20 },
  ],
};

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
  e.preventDefault();
  if (email) {  // REMOVED password check
    try {
      const { data } = await supabase.from('users').select('*').eq('email', email).single();
      if (data) {
        onLogin(data);
      } else {
        alert('User not found');
      }
    } catch (err) {
      alert('Login error: ' + err.message);
    }
  } else {
    alert('Please enter email');
  }
};

  return (
    <div style={{ width: '100vw', height: '100vh', background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '50px', borderRadius: '12px', width: '100%', maxWidth: '420px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>PerfTrack Pro</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '30px' }}>Enterprise KPI System</p>
        <form onSubmit={handleLogin}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ width: '100%', padding: '12px', marginBottom: '12px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={{ width: '100%', padding: '12px', marginBottom: '24px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
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
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>Total Employees</p>
          <p style={{ margin: '12px 0 0 0', fontSize: '24px', fontWeight: '700', color: COLORS.secondary }}>256</p>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>Active Goals</p>
          <p style={{ margin: '12px 0 0 0', fontSize: '24px', fontWeight: '700', color: COLORS.secondary }}>480</p>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>Avg Performance</p>
          <p style={{ margin: '12px 0 0 0', fontSize: '24px', fontWeight: '700', color: COLORS.secondary }}>82%</p>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>KPIs Tracked</p>
          <p style={{ margin: '12px 0 0 0', fontSize: '24px', fontWeight: '700', color: COLORS.secondary }}>155+</p>
        </div>
      </div>
    </div>
  );
}

function KPILibrary() {
  const [selectedDept, setSelectedDept] = useState('HR');

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>📚 KPI Library (155+ KPIs)</h2>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
        {Object.keys(KPI_LIBRARY).map(dept => (
          <button key={dept} onClick={() => setSelectedDept(dept)} style={{ padding: '8px 16px', background: selectedDept === dept ? COLORS.secondary : COLORS.light, color: selectedDept === dept ? 'white' : COLORS.text, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
            {dept}
          </button>
        ))}
      </div>
      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: COLORS.light }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '13px' }}>KPI Name</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '13px' }}>Target</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '13px' }}>Weight</th>
            </tr>
          </thead>
          <tbody>
            {KPI_LIBRARY[selectedDept].map(kpi => (
              <tr key={kpi.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: '12px', fontSize: '13px' }}>{kpi.name}</td>
                <td style={{ padding: '12px', fontSize: '13px' }}>{kpi.target} {kpi.unit}</td>
                <td style={{ padding: '12px', fontSize: '13px', fontWeight: '600', color: COLORS.secondary }}>{kpi.weight}%</td>
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
          {[
            { name: 'Sales', score: 88 },
            { name: 'Development', score: 85 },
            { name: 'HR', score: 82 }
          ].map((dept, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                <strong>{dept.name}</strong>
                <span>{dept.score}%</span>
              </div>
              <div style={{ background: COLORS.light, height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ background: COLORS.secondary, height: '100%', width: `${dept.score}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Key Insights</h3>
          <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#6b7280' }}>
            <div style={{ marginBottom: '8px' }}>✅ Sales outperforming by 6%</div>
            <div style={{ marginBottom: '8px' }}>📈 Overall company KPI hit: 82%</div>
            <div style={{ marginBottom: '8px' }}>🎯 3 employees on track for bonus</div>
            <div>⚠️ Support needs improvement focus</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
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
            <button key={m.id} onClick={() => setActiveModule(m.id)} style={{ width: '100%', padding: '12px 20px', background: activeModule === m.id ? COLORS.secondary : 'transparent', color: 'white', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: activeModule === m.id ? '600' : '500', transition: 'background 0.3s' }} onMouseEnter={(e) => e.target.style.background = activeModule === m.id ? COLORS.secondary : '#374151'} onMouseLeave={(e) => e.target.style.background = activeModule === m.id ? COLORS.secondary : 'transparent'}>
              <Icon size={18} />
              {sidebarOpen && m.name}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: 'white', padding: '16px 24px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: COLORS.text }}>{sidebarOpen ? <X size={24} /> : <Menu size={24} />}</button>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: COLORS.text }}>PerfTrack Pro</h1>
          <button onClick={() => setIsLoggedIn(false)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: COLORS.danger, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}><LogOut size={16} />Logout</button>
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