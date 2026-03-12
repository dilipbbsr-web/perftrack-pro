import React, { useState, useEffect } from 'react';
import { Users, Target, LogOut, Home, Plus } from 'lucide-react';
import { supabase } from './supabaseClient';

const COLORS = { primary: '#1f2937', secondary: '#3b82f6', accent: '#10b981', danger: '#ef4444', light: '#f3f4f6', text: '#111827', border: '#e5e7eb', warning: '#f59e0b' };

// ==================== SUPABASE FUNCTIONS ====================

async function fetchUsers() {
  try {
    const { data, error } = await supabase.from('users').select('*').order('id', { ascending: false });
    return error ? [] : data || [];
  } catch { return []; }
}

async function fetchEmployees() {
  try {
    const { data, error } = await supabase.from('employees').select('*').order('id', { ascending: false });
    return error ? [] : data || [];
  } catch { return []; }
}

async function fetchKPIs() {
  try {
    const { data, error } = await supabase.from('kpis').select('*').order('id', { ascending: false });
    return error ? [] : data || [];
  } catch { return []; }
}

// ==================== LOGIN PAGE ====================

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
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ width: '100%', padding: '10px 12px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', background: COLORS.secondary, color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Sign In</button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>Any email/password works</div>
      </div>
    </div>
  );
}

// ==================== DASHBOARD ====================

function Dashboard() {
  const [stats, setStats] = useState({ users: 0, employees: 0, kpis: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const users = await fetchUsers();
      const employees = await fetchEmployees();
      const kpis = await fetchKPIs();
      setStats({ users: users.length, employees: employees.length, kpis: kpis.length });
    };
    loadStats();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', color: COLORS.text }}>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
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

// ==================== USER MANAGEMENT ====================

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'Employee', department: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await fetchUsers();
    setUsers(data);
  };

  const handleSave = async () => {
    if (!form.name || !form.email) {
      alert('Fill all fields');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase.from('users').update(form).eq('id', editingId);
        if (!error) {
          setUsers(users.map(u => u.id === editingId ? { ...u, ...form } : u));
          setEditingId(null);
        }
      } else {
        const { data, error } = await supabase.from('users').insert([form]).select();
        if (!error) setUsers([...users, data[0]]);
      }
      setForm({ name: '', email: '', role: 'Employee', department: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete user?')) {
      await supabase.from('users').delete().eq('id', id);
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleEdit = (user) => {
    setForm(user);
    setEditingId(user.id);
    setShowForm(true);
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>User Management</h2>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', email: '', role: 'Employee', department: '' }); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: COLORS.secondary, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}><Plus size={18} />Add User</button>
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', marginBottom: '30px', border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>{editingId ? 'Edit User' : 'Add User'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px' }} />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px' }} />
            <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px' }}>
              <option>Admin</option>
              <option>Manager</option>
              <option>Employee</option>
            </select>
            <input type="text" placeholder="Department" value={form.department} onChange={(e) => setForm({...form, department: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px' }} />
          </div>
          <button onClick={handleSave} style={{ padding: '8px 16px', background: COLORS.accent, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}>{editingId ? 'Update' : 'Add'}</button>
          <button onClick={() => { setShowForm(false); setEditingId(null); setForm({ name: '', email: '', role: 'Employee', department: '' }); }} style={{ padding: '8px 16px', background: COLORS.border, border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: COLORS.light }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Role</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Department</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: '12px' }}>{u.name}</td>
                <td style={{ padding: '12px' }}>{u.email}</td>
                <td style={{ padding: '12px' }}>{u.role}</td>
                <td style={{ padding: '12px' }}>{u.department}</td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => handleEdit(u)} style={{ padding: '4px 8px', background: COLORS.secondary, color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '4px', fontSize: '12px' }}>✏️ Edit</button>
                  <button onClick={() => handleDelete(u.id)} style={{ padding: '4px 8px', background: COLORS.danger, color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== EMPLOYEE MANAGEMENT ====================

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', team: '', department: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const data = await fetchEmployees();
    setEmployees(data);
  };

  const handleSave = async () => {
    if (!form.name || !form.team) {
      alert('Fill all fields');
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase.from('employees').update(form).eq('id', editingId);
        if (!error) {
          setEmployees(employees.map(e => e.id === editingId ? { ...e, ...form } : e));
          setEditingId(null);
        }
      } else {
        const { data, error } = await supabase.from('employees').insert([form]).select();
        if (!error) setEmployees([...employees, data[0]]);
      }
      setForm({ name: '', team: '', department: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete employee?')) {
      await supabase.from('employees').delete().eq('id', id);
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  const handleEdit = (emp) => {
    setForm(emp);
    setEditingId(emp.id);
    setShowForm(true);
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Employee Management</h2>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', team: '', department: '' }); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: COLORS.secondary, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}><Plus size={18} />Add Employee</button>
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', marginBottom: '30px', border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>{editingId ? 'Edit Employee' : 'Add Employee'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px' }} />
            <input type="text" placeholder="Team" value={form.team} onChange={(e) => setForm({...form, team: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px' }} />
            <input type="text" placeholder="Department" value={form.department} onChange={(e) => setForm({...form, department: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px', gridColumn: '1 / -1' }} />
          </div>
          <button onClick={handleSave} style={{ padding: '8px 16px', background: COLORS.accent, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}>{editingId ? 'Update' : 'Add'}</button>
          <button onClick={() => { setShowForm(false); setEditingId(null); setForm({ name: '', team: '', department: '' }); }} style={{ padding: '8px 16px', background: COLORS.border, border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: COLORS.light }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Team</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Department</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(e => (
              <tr key={e.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: '12px' }}>{e.name}</td>
                <td style={{ padding: '12px' }}>{e.team}</td>
                <td style={{ padding: '12px' }}>{e.department}</td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => handleEdit(e)} style={{ padding: '4px 8px', background: COLORS.secondary, color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '4px', fontSize: '12px' }}>✏️ Edit</button>
                  <button onClick={() => handleDelete(e.id)} style={{ padding: '4px 8px', background: COLORS.danger, color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== KPI MANAGEMENT ====================

function KPIManagement() {
  const [kpis, setKpis] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', formula: '', unit: '', weight: 0, threshold: 0 });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadKPIs();
  }, []);

  const loadKPIs = async () => {
    const data = await fetchKPIs();
    setKpis(data);
  };

  const handleSave = async () => {
    if (!form.name) {
      alert('Fill all fields');
      return;
    }

    const formData = { ...form, weight: parseFloat(form.weight) || 0, threshold: parseFloat(form.threshold) || 0 };

    try {
      if (editingId) {
        const { error } = await supabase.from('kpis').update(formData).eq('id', editingId);
        if (!error) {
          setKpis(kpis.map(k => k.id === editingId ? { ...k, ...formData } : k));
          setEditingId(null);
        }
      } else {
        const { data, error } = await supabase.from('kpis').insert([formData]).select();
        if (!error) setKpis([...kpis, data[0]]);
      }
      setForm({ name: '', formula: '', unit: '', weight: 0, threshold: 0 });
      setShowForm(false);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete KPI?')) {
      await supabase.from('kpis').delete().eq('id', id);
      setKpis(kpis.filter(k => k.id !== id));
    }
  };

  const handleEdit = (kpi) => {
    setForm(kpi);
    setEditingId(kpi.id);
    setShowForm(true);
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>KPI Management</h2>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', formula: '', unit: '', weight: 0, threshold: 0 }); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: COLORS.secondary, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}><Plus size={18} />Add KPI</button>
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', marginBottom: '30px', border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>{editingId ? 'Edit KPI' : 'Add KPI'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <input type="text" placeholder="KPI Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px' }} />
            <input type="text" placeholder="Unit" value={form.unit} onChange={(e) => setForm({...form, unit: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px' }} />
            <input type="text" placeholder="Formula" value={form.formula} onChange={(e) => setForm({...form, formula: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px', gridColumn: '1 / -1' }} />
            <input type="number" placeholder="Weight" value={form.weight} onChange={(e) => setForm({...form, weight: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px' }} />
            <input type="number" placeholder="Threshold" value={form.threshold} onChange={(e) => setForm({...form, threshold: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px' }} />
          </div>
          <button onClick={handleSave} style={{ padding: '8px 16px', background: COLORS.accent, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}>{editingId ? 'Update' : 'Add'}</button>
          <button onClick={() => { setShowForm(false); setEditingId(null); setForm({ name: '', formula: '', unit: '', weight: 0, threshold: 0 }); }} style={{ padding: '8px 16px', background: COLORS.border, border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: COLORS.light }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Formula</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Unit</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Weight</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Threshold</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {kpis.map(k => (
              <tr key={k.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: '12px' }}>{k.name}</td>
                <td style={{ padding: '12px', fontSize: '12px' }}>{k.formula}</td>
                <td style={{ padding: '12px' }}>{k.unit}</td>
                <td style={{ padding: '12px' }}>{k.weight}</td>
                <td style={{ padding: '12px' }}>{k.threshold}</td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => handleEdit(k)} style={{ padding: '4px 8px', background: COLORS.secondary, color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '4px', fontSize: '12px' }}>✏️ Edit</button>
                  <button onClick={() => handleDelete(k.id)} style={{ padding: '4px 8px', background: COLORS.danger, color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== PERFORMANCE TRACKING ====================

function PerformanceTracking() {
  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', color: COLORS.text }}>Performance Tracking</h2>
      <div style={{ background: 'white', padding: '40px', borderRadius: '8px', border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '10px' }}>🚀 Coming Soon</p>
        <p style={{ color: '#6b7280' }}>Performance tracking features are coming in the next update</p>
      </div>
    </div>
  );
}

// ==================== COACHING & DEVELOPMENT ====================

function CoachingDevelopment() {
  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', color: COLORS.text }}>Coaching & Development</h2>
      <div style={{ background: 'white', padding: '40px', borderRadius: '8px', border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '10px' }}>🚀 Coming Soon</p>
        <p style={{ color: '#6b7280' }}>Coaching and development features are coming in the next update</p>
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeModule, setActiveModule] = useState('dashboard');

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveModule('dashboard');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'employees', name: 'Employees', icon: Users },
    { id: 'kpis', name: 'KPIs', icon: Target },
  ];

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard': return <Dashboard />;
      case 'users': return <UserManagement />;
      case 'employees': return <EmployeeManagement />;
      case 'kpis': return <KPIManagement />;
      case 'performance': return <PerformanceTracking />;
      case 'coaching': return <CoachingDevelopment />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.light, fontFamily: "'Segoe UI'" }}>
      {/* Sidebar */}
      <div style={{ width: '200px', background: COLORS.primary, color: 'white', padding: '20px 0', borderRight: `1px solid ${COLORS.border}`, overflowY: 'auto' }}>
        <h1 style={{ margin: '0 20px 30px 20px', fontSize: '16px', fontWeight: '700' }}>PerfTrack Pro</h1>

        {modules.map(m => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: activeModule === m.id ? COLORS.secondary : 'transparent',
                color: 'white',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                fontWeight: activeModule === m.id ? '600' : '500',
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.background = activeModule === m.id ? COLORS.secondary : '#374151'}
              onMouseLeave={(e) => e.target.style.background = activeModule === m.id ? COLORS.secondary : 'transparent'}
            >
              <Icon size={18} />
              {m.name}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
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

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {renderModule()}
        </div>
      </div>
    </div>
  );
}
