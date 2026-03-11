import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Target, BookOpen, Menu, X, LogOut, Home, Plus } from 'lucide-react';
import { supabase } from './supabaseClient';

const COLORS = { primary: '#1f2937', secondary: '#3b82f6', accent: '#10b981', warning: '#f59e0b', danger: '#ef4444', light: '#f3f4f6', text: '#111827', border: '#e5e7eb' };
const APP_NAME = 'PerfTrack Pro';

async function fetchUsers() {
  try {
    const { data, error } = await supabase.from('users').select('*');
    return error ? [] : data || [];
  } catch { return []; }
}

async function fetchEmployees() {
  try {
    const { data, error } = await supabase.from('employees').select('*');
    return error ? [] : data || [];
  } catch { return []; }
}

async function fetchKPIs() {
  try {
    const { data, error } = await supabase.from('kpis').select('*');
    return error ? [] : data || [];
  } catch { return []; }
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Employee');

  return (
    <div style={{ width: '100vw', height: '100vh', background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: COLORS.text }}>{APP_NAME}</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '30px' }}>Performance Management System</p>
        <div style={{ marginBottom: '20px' }}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px' }} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px' }} />
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}>
            <option>Admin</option>
            <option>Manager</option>
            <option>Employee</option>
          </select>
        </div>
        <button onClick={() => email && password && onLogin({ email, role, name: email.split('@')[0] })} style={{ width: '100%', padding: '12px', background: COLORS.secondary, color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Sign In</button>
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>Any email/password works</div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({ users: 0, employees: 0, kpis: 0 });
  useEffect(() => {
    const load = async () => {
      const users = await fetchUsers();
      const employees = await fetchEmployees();
      const kpis = await fetchKPIs();
      setStats({ users: users.length, employees: employees.length, kpis: kpis.length });
    };
    load();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px' }}>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
          <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '14px' }}>Total Users</p>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: COLORS.secondary }}>{stats.users}</p>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
          <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '14px' }}>Total Employees</p>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: COLORS.accent }}>{stats.employees}</p>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
          <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '14px' }}>Total KPIs</p>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: COLORS.warning }}>{stats.kpis}</p>
        </div>
      </div>
    </div>
  );
}

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', role: 'Employee', department: '' });
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const add = async () => {
    if (!form.name || !form.email) { alert('Fill all fields'); return; }
    const { data, error } = await supabase.from('users').insert([form]).select();
    if (!error) { setUsers([...users, data[0]]); setForm({ name: '', email: '', role: 'Employee', department: '' }); setShow(false); }
  };

  const del = async (id) => {
    if (window.confirm('Delete?')) {
      await supabase.from('users').delete().eq('id', id);
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>User Management</h2>
        <button onClick={() => setShow(!show)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: COLORS.secondary, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><Plus size={18} />Add</button>
      </div>
      {show && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', marginBottom: '30px', border: `1px solid ${COLORS.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px' }} />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px' }} />
          </div>
          <button onClick={add} style={{ padding: '8px 16px', background: COLORS.accent, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}>Add User</button>
          <button onClick={() => setShow(false)} style={{ padding: '8px 16px', background: COLORS.border, border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
        </div>
      )}
      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
        <table style={{ width: '100%' }}>
          <thead>
            <tr style={{ background: COLORS.light }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: '12px' }}>{u.name}</td>
                <td style={{ padding: '12px' }}>{u.email}</td>
                <td style={{ padding: '12px' }}>{u.role}</td>
                <td style={{ padding: '12px' }}><button onClick={() => del(u.id)} style={{ padding: '4px 8px', background: COLORS.danger, color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmployeeManagement() {
  return <div style={{ padding: '30px' }}><h2>Employee Management</h2><p>Coming soon...</p></div>;
}

function KPIManagement() {
  return <div style={{ padding: '30px' }}><h2>KPI Management</h2><p>Coming soon...</p></div>;
}

export default function App() {
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [module, setModule] = useState('dashboard');
  const [sidebar, setSidebar] = useState(true);

  if (!logged) return <LoginPage onLogin={(u) => { setUser(u); setLogged(true); }} />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.light }}>
      <div style={{ width: sidebar ? '260px' : '0', background: COLORS.primary, color: 'white', padding: sidebar ? '20px 0' : '0', overflow: 'hidden', transition: 'all 0.3s' }}>
        <h1 style={{ margin: '0 20px 20px 20px', fontSize: '14px', fontWeight: '700' }}>{APP_NAME}</h1>
        {[
          { id: 'dashboard', name: 'Dashboard', icon: Home },
          { id: 'users', name: 'Users', icon: Users },
          { id: 'employees', name: 'Employees', icon: Users },
          { id: 'kpis', name: 'KPIs', icon: Target },
        ].map(m => {
          const Icon = m.icon;
          return (
            <button key={m.id} onClick={() => setModule(m.id)} style={{ width: '100%', padding: '12px 20px', background: module === m.id ? COLORS.secondary : 'transparent', color: 'white', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon size={16} /> {sidebar && m.name}
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ background: 'white', padding: '12px 20px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => setSidebar(!sidebar)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>{sidebar ? <X size={20} /> : <Menu size={20} />}</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px' }}>Welcome, {user?.name}!</span>
            <button onClick={() => { setLogged(false); setUser(null); }} style={{ padding: '6px 12px', background: COLORS.danger, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><LogOut size={14} />Logout</button>
          </div>
        </div>
        {module === 'dashboard' && <Dashboard />}
        {module === 'users' && <UserManagement />}
        {module === 'employees' && <EmployeeManagement />}
        {module === 'kpis' && <KPIManagement />}
      </div>
    </div>
  );
}