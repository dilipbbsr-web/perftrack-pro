import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Target, BookOpen, Menu, X, LogOut, Home, Plus } from 'lucide-react';
import { supabase } from './supabaseClient';

const COLORS = {
  primary: '#1f2937',
  secondary: '#3b82f6',
  accent: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  light: '#f3f4f6',
  text: '#111827',
  border: '#e5e7eb'
};

const APP_NAME = 'PerfTrack Pro';

// ==================== SUPABASE FUNCTIONS ====================

async function fetchUsers() {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching users:', err);
    return [];
  }
}

async function fetchEmployees() {
  try {
    const { data, error } = await supabase.from('employees').select('*');
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching employees:', err);
    return [];
  }
}

async function fetchKPIs() {
  try {
    const { data, error } = await supabase.from('kpis').select('*');
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching KPIs:', err);
    return [];
  }
}

// ==================== LOGIN PAGE ====================
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('Employee');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin({ email, role: selectedRole, name: email.split('@')[0] });
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: COLORS.text }}>
          {APP_NAME}
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '30px' }}>
          Performance Management System
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: COLORS.text }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: COLORS.text }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: COLORS.text }}>
              Select Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                backgroundColor: 'white'
              }}
            >
              <option>Admin</option>
              <option>Manager</option>
              <option>Employee</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: COLORS.secondary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
          Demo credentials: any email/password combination
        </div>
      </div>
    </div>
  );
}

// ==================== DASHBOARD ====================
function Dashboard() {
  const [stats, setStats] = useState({ employees: 0, kpis: 0, users: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const employees = await fetchEmployees();
      const kpis = await fetchKPIs();
      const users = await fetchUsers();
      setStats({
        employees: employees.length,
        kpis: kpis.length,
        users: users.length
      });
    };
    loadStats();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px' }}>Dashboard</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '8px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>Total Users</p>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: COLORS.secondary }}>{stats.users}</p>
        </div>

        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '8px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>Total Employees</p>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: COLORS.accent }}>{stats.employees}</p>
        </div>

        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '8px',
          border: `1px solid ${COLORS.border}`
        }}>
          <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>Total KPIs</p>
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
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Employee', department: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await fetchUsers();
    setUsers(data);
  };

  const handleAddOrUpdate = async () => {
    if (!formData.name || !formData.email) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (editingId) {
        const { data, error } = await supabase
          .from('users')
          .update(formData)
          .eq('id', editingId)
          .select();

        if (error) throw error;
        setUsers(users.map(u => u.id === editingId ? data[0] : u));
        setEditingId(null);
      } else {
        const { data, error } = await supabase
          .from('users')
          .insert([formData])
          .select();

        if (error) throw error;
        setUsers([...users, data[0]]);
      }

      setFormData({ name: '', email: '', role: 'Employee', department: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Error:', err);
      alert('Error saving user');
    }
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error('Error:', err);
      alert('Error deleting user');
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>User Management</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: '', email: '', role: 'Employee', department: '' });
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: COLORS.secondary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      {showForm && (
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '8px',
          marginBottom: '30px',
          border: `1px solid ${COLORS.border}`
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
            {editingId ? 'Edit User' : 'Add New User'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                padding: '10px 12px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                padding: '10px 12px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              style={{
                padding: '10px 12px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option>Admin</option>
              <option>Manager</option>
              <option>Employee</option>
            </select>
            <input
              type="text"
              placeholder="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              style={{
                padding: '10px 12px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              onClick={handleAddOrUpdate}
              style={{
                padding: '10px 20px',
                background: COLORS.accent,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {editingId ? 'Update User' : 'Add User'}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ name: '', email: '', role: 'Employee', department: '' });
              }}
              style={{
                padding: '10px 20px',
                background: COLORS.border,
                color: COLORS.text,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: COLORS.light }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Name</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Email</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Role</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Department</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.id} style={{ borderTop: `1px solid ${COLORS.border}`, background: idx % 2 === 0 ? 'white' : COLORS.light }}>
                <td style={{ padding: '16px' }}>{user.name}</td>
                <td style={{ padding: '16px' }}>{user.email}</td>
                <td style={{ padding: '16px' }}>{user.role}</td>
                <td style={{ padding: '16px' }}>{user.department}</td>
                <td style={{ padding: '16px' }}>
                  <button
                    onClick={() => handleEdit(user)}
                    style={{
                      padding: '6px 12px',
                      background: COLORS.secondary,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '8px',
                      fontSize: '12px'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={{
                      padding: '6px 12px',
                      background: COLORS.danger,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    🗑️ Delete
                  </button>
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
  const [formData, setFormData] = useState({ name: '', team: '', department: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const data = await fetchEmployees();
    setEmployees(data);
  };

  const handleAddOrUpdate = async () => {
    if (!formData.name || !formData.team) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (editingId) {
        const { data, error } = await supabase
          .from('employees')
          .update(formData)
          .eq('id', editingId)
          .select();

        if (error) throw error;
        setEmployees(employees.map(e => e.id === editingId ? data[0] : e));
        setEditingId(null);
      } else {
        const { data, error } = await supabase
          .from('employees')
          .insert([formData])
          .select();

        if (error) throw error;
        setEmployees([...employees, data[0]]);
      }

      setFormData({ name: '', team: '', department: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Error:', err);
      alert('Error saving employee');
    }
  };

  const handleEdit = (emp) => {
    setFormData(emp);
    setEditingId(emp.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      const { error } = await supabase.from('employees').delete().eq('id', id);
      if (error) throw error;
      setEmployees(employees.filter(e => e.id !== id));
    } catch (err) {
      console.error('Error:', err);
      alert('Error deleting employee');
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Employee Management</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: '', team: '', department: '' });
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: COLORS.secondary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {showForm && (
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '8px',
          marginBottom: '30px',
          border: `1px solid ${COLORS.border}`
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
            {editingId ? 'Edit Employee' : 'Add New Employee'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                padding: '10px 12px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px'
              }}
            />
            <input
              type="text"
              placeholder="Team"
              value={formData.team}
              onChange={(e) => setFormData({ ...formData, team: e.target.value })}
              style={{
                padding: '10px 12px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px'
              }}
            />
            <input
              type="text"
              placeholder="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              style={{
                padding: '10px 12px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                gridColumn: '1 / -1'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              onClick={handleAddOrUpdate}
              style={{
                padding: '10px 20px',
                background: COLORS.accent,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {editingId ? 'Update' : 'Add'}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ name: '', team: '', department: '' });
              }}
              style={{
                padding: '10px 20px',
                background: COLORS.border,
                color: COLORS.text,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: COLORS.light }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Name</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Team</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Department</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => (
              <tr key={emp.id} style={{ borderTop: `1px solid ${COLORS.border}`, background: idx % 2 === 0 ? 'white' : COLORS.light }}>
                <td style={{ padding: '16px' }}>{emp.name}</td>
                <td style={{ padding: '16px' }}>{emp.team}</td>
                <td style={{ padding: '16px' }}>{emp.department}</td>
                <td style={{ padding: '16px' }}>
                  <button
                    onClick={() => handleEdit(emp)}
                    style={{
                      padding: '6px 12px',
                      background: COLORS.secondary,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '8px',
                      fontSize: '12px'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(emp.id)}
                    style={{
                      padding: '6px 12px',
                      background: COLORS.danger,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    🗑️ Delete
                  </button>
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
  const [formData, setFormData] = useState({ name: '', formula: '', unit: '', weight: '', threshold: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadKPIs();
  }, []);

  const loadKPIs = async () => {
    const data = await fetchKPIs();
    setKpis(data);
  };

  const handleAddOrUpdate = async () => {
    if (!formData.name) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const dataToSave = {
        ...formData,
        weight: parseFloat(formData.weight) || 0,
        threshold: parseFloat(formData.threshold) || 0
      };

      if (editingId) {
        const { data, error } = await supabase
          .from('kpis')
          .update(dataToSave)
          .eq('id', editingId)
          .select();

        if (error) throw error;
        setKpis(kpis.map(k => k.id === editingId ? data[0] : k));
        setEditingId(null);
      } else {
        const { data, error } = await supabase
          .from('kpis')
          .insert([dataToSave])
          .select();

        if (error) throw error;
        setKpis([...kpis, data[0]]);
      }

      setFormData({ name: '', formula: '', unit: '', weight: '', threshold: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Error:', err);
      alert('Error saving KPI');
    }
  };

  const handleEdit = (kpi) => {
    setFormData(kpi);
    setEditingId(kpi.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      const { error } = await supabase.from('kpis').delete().eq('id', id);
      if (error) throw error;
      setKpis(kpis.filter(k => k.id !== id));
    } catch (err) {
      console.error('Error:', err);
      alert('Error deleting KPI');
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>KPI Management</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: '', formula: '', unit: '', weight: '', threshold: '' });
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: COLORS.secondary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          <Plus size={18} />
          Add KPI
        </button>
      </div>

      {showForm && (
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '8px',
          marginBottom: '30px',
          border: `1px solid ${COLORS.border}`
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
            {editingId ? 'Edit KPI' : 'Add New KPI'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <input
              type="text"
              placeholder="KPI Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                padding: '10px 12px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px'
              }}
            />
            <input
              type="text"
              placeholder="Unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              style={{
                padding: '10px 12px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px'
              }}
            />
            <input
              type="text"
              placeholder="Formula"
              value={formData.formula}
              onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
              style={{
                padding: '10px 12px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                gridColumn: '1 / -1'
              }}
            />
            <input
              type="number"
              placeholder="Weight"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              style={{
                padding: '10px 12px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px'
              }}
            />
            <input
              type="number"
              placeholder="Threshold"
              value={formData.threshold}
              onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
              style={{
                padding: '10px 12px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              onClick={handleAddOrUpdate}
              style={{
                padding: '10px 20px',
                background: COLORS.accent,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {editingId ? 'Update' : 'Add'}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ name: '', formula: '', unit: '', weight: '', threshold: '' });
              }}
              style={{
                padding: '10px 20px',
                background: COLORS.border,
                color: COLORS.text,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: COLORS.light }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Name</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Formula</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Unit</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Weight</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Threshold</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {kpis.map((kpi, idx) => (
              <tr key={kpi.id} style={{ borderTop: `1px solid ${COLORS.border}`, background: idx % 2 === 0 ? 'white' : COLORS.light }}>
                <td style={{ padding: '16px' }}>{kpi.name}</td>
                <td style={{ padding: '16px', fontSize: '12px' }}>{kpi.formula}</td>
                <td style={{ padding: '16px' }}>{kpi.unit}</td>
                <td style={{ padding: '16px' }}>{kpi.weight}</td>
                <td style={{ padding: '16px' }}>{kpi.threshold}</td>
                <td style={{ padding: '16px' }}>
                  <button
                    onClick={() => handleEdit(kpi)}
                    style={{
                      padding: '6px 12px',
                      background: COLORS.secondary,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '8px',
                      fontSize: '12px'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(kpi.id)}
                    style={{
                      padding: '6px 12px',
                      background: COLORS.danger,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================
export default function PerformanceManagementApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setActiveModule('dashboard');
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
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'employees', name: 'Employee Management', icon: Users },
    { id: 'kpis', name: 'KPI Management', icon: Target },
    { id: 'performance', name: 'Performance Tracking', icon: TrendingUp },
    { id: 'coaching', name: 'Coaching & Development', icon: BookOpen }
  ];

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard': return <Dashboard />;
      case 'users': return <UserManagement />;
      case 'employees': return <EmployeeManagement />;
      case 'kpis': return <KPIManagement />;
      case 'performance': return <div style={{ padding: '30px' }}><h2>Performance Tracking</h2><p>Coming soon...</p></div>;
      case 'coaching': return <div style={{ padding: '30px' }}><h2>Coaching & Development</h2><p>Coming soon...</p></div>;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.light, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '260px' : '0',
        background: COLORS.primary,
        color: 'white',
        padding: sidebarOpen ? '24px 0' : '0',
        transition: 'all 0.3s',
        overflow: 'hidden',
        borderRight: `1px solid ${COLORS.border}`
      }}>
        <h1 style={{ margin: sidebarOpen ? '0 20px 30px 20px' : '0', fontSize: '16px', fontWeight: '700' }}>
          {APP_NAME}
        </h1>

        {modules.map(module => {
          const Icon = module.icon;
          return (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: activeModule === module.id ? COLORS.secondary : 'transparent',
                color: 'white',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                fontWeight: activeModule === module.id ? '600' : '500',
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.background = activeModule === module.id ? COLORS.secondary : '#374151'}
              onMouseLeave={(e) => e.target.style.background = activeModule === module.id ? COLORS.secondary : 'transparent'}
            >
              <Icon size={18} />
              {sidebarOpen && module.name}
            </button>
          );
        })}

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px 20px',
            background: 'transparent',
            color: 'white',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
            marginTop: '30px',
            transition: 'background 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#374151'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          <LogOut size={18} />
          {sidebarOpen && 'Logout'}
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          padding: '16px 24px',
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: COLORS.text,
              fontSize: '20px'
            }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: COLORS.text }}>
              Welcome, {currentUser?.name}!
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: COLORS.secondary,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700'
            }}>
              {currentUser?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Module Content */}
        {renderModule()}
      </div>
    </div>
  );
}
