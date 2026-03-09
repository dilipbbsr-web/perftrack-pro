import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users,  TrendingUp, Target, BookOpen, Menu, X, LogOut, Home, Plus, Edit, Trash2, Eye, ArrowRight,    CheckCircle } from 'lucide-react';

// Color Theme
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

// ==================== MOCK DATA ====================
const MOCK_USERS = [
  { id: 1, name: 'John Admin', email: 'john@company.com', role: 'Admin', department: 'HR' },
  { id: 2, name: 'Sarah Manager', email: 'sarah@company.com', role: 'Manager', department: 'Sales' },
  { id: 3, name: 'Mike Employee', email: 'mike@company.com', role: 'Employee', department: 'Sales' }
];

const MOCK_EMPLOYEES = [
  { id: 1, name: 'Mike Johnson', team: 'Sales Team A', department: 'Sales', process: 'Direct Sales', kpis: ['Revenue Generated', 'Lead Conversion'] },
  { id: 2, name: 'Lisa Chen', team: 'Support Team', department: 'Customer Success', process: 'Support Process', kpis: ['Response Time', 'Satisfaction Score'] },
  { id: 3, name: 'David Brown', team: 'Sales Team B', department: 'Sales', process: 'Direct Sales', kpis: ['Revenue Generated', 'Deal Closure Rate'] },
  { id: 4, name: 'Emma Wilson', team: 'Tech Team', department: 'Engineering', process: 'Development Process', kpis: ['Code Quality', 'Task Completion Rate'] }
];

const MOCK_KPIS = [
  { id: 1, name: 'Revenue Generated', formula: 'Total Sales Value', unit: '$', weight: 40, threshold: 50000 },
  { id: 2, name: 'Lead Conversion', formula: '(Converted Leads / Total Leads) * 100', unit: '%', weight: 30, threshold: 15 },
  { id: 3, name: 'Response Time', formula: 'Average Response Hours', unit: 'hrs', weight: 20, threshold: 24 },
  { id: 4, name: 'Satisfaction Score', formula: 'Average Customer Rating', unit: '/10', weight: 50, threshold: 8 },
  { id: 5, name: 'Deal Closure Rate', formula: '(Closed Deals / Pipeline Deals) * 100', unit: '%', weight: 35, threshold: 25 },
  { id: 6, name: 'Code Quality', formula: 'Defect Ratio per 1000 LOC', unit: '%', weight: 40, threshold: 5 },
  { id: 7, name: 'Task Completion Rate', formula: '(Completed Tasks / Total Tasks) * 100', unit: '%', weight: 60, threshold: 90 }
];

const MOCK_PERFORMANCE_DATA = [
  { employee: 'Mike Johnson', date: '2024-01-15', 'Revenue Generated': 55000, 'Lead Conversion': 18, score: 85 },
  { employee: 'Mike Johnson', date: '2024-01-22', 'Revenue Generated': 62000, 'Lead Conversion': 22, score: 90 },
  { employee: 'Lisa Chen', date: '2024-01-15', 'Response Time': 12, 'Satisfaction Score': 8.5, score: 88 },
  { employee: 'Lisa Chen', date: '2024-01-22', 'Response Time': 10, 'Satisfaction Score': 9.0, score: 92 },
];

const MOCK_FEEDBACK = [
  { id: 1, employeeId: 1, from: 'Sarah Manager', date: '2024-01-20', comment: 'Excellent sales performance this month!', type: 'Positive' },
  { id: 2, employeeId: 2, from: 'Sarah Manager', date: '2024-01-18', comment: 'Great customer service skills', type: 'Positive' },
  { id: 3, employeeId: 1, from: 'Sarah Manager', date: '2024-01-10', comment: 'Focus on lead quality over quantity', type: 'Constructive' }
];

const MOCK_IMPROVEMENT_PLANS = [
  { id: 1, employeeId: 1, title: 'Lead Quality Enhancement', goal: 'Improve lead conversion rate to 25%', status: 'In Progress', dueDate: '2024-03-15', progress: 65 },
  { id: 2, employeeId: 2, title: 'Response Time Optimization', goal: 'Reduce response time to 8 hours', status: 'Completed', dueDate: '2024-02-28', progress: 100 }
];

// ==================== COMPONENTS ====================

// Login Component
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('Employee');

  const handleLogin = () => {
    if (email && password) {
      onLogin({ email, role: selectedRole });
    }
  };

  return (
    <div style={{
      background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.secondary, marginBottom: '8px' }}>
            {APP_NAME}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            Performance Management System
          </div>
        </div>

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
              boxSizing: 'border-box',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = COLORS.secondary}
            onBlur={(e) => e.target.style.borderColor = COLORS.border}
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
              boxSizing: 'border-box',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = COLORS.secondary}
            onBlur={(e) => e.target.style.borderColor = COLORS.border}
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
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '12px',
            background: COLORS.secondary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#2563eb'}
          onMouseLeave={(e) => e.target.style.background = COLORS.secondary}
        >
          Sign In
        </button>

        <div style={{ marginTop: '20px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
          Demo credentials: any email/password combination
        </div>
      </div>
    </div>
  );
}

// User Management Module
function UserManagement() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Employee', department: '' });

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      setUsers([...users, { id: users.length + 1, ...newUser }]);
      setNewUser({ name: '', email: '', role: 'Employee', department: '' });
      setShowModal(false);
    }
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: COLORS.text }}>User Management</h2>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '8px 16px',
            background: COLORS.secondary,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {users.map(user => (
          <div key={user.id} style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: COLORS.text }}>{user.name}</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{user.email}</div>
              </div>
              <button
                onClick={() => handleDeleteUser(user.id)}
                style={{ background: 'none', border: 'none', color: COLORS.danger, cursor: 'pointer' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <span style={{
                padding: '4px 8px',
                background: '#eff6ff',
                color: COLORS.secondary,
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: '600'
              }}>
                {user.role}
              </span>
              <span style={{
                padding: '4px 8px',
                background: '#f0fdf4',
                color: COLORS.accent,
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: '600'
              }}>
                {user.department}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: COLORS.text }}>Add New User</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block', color: COLORS.text }}>Name</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block', color: COLORS.text }}>Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block', color: COLORS.text }}>Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                <option>Admin</option>
                <option>Manager</option>
                <option>Employee</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block', color: COLORS.text }}>Department</label>
              <input
                type="text"
                value={newUser.department}
                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleAddUser}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: COLORS.secondary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Add User
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: COLORS.light,
                  color: COLORS.text,
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Employee Management Module
function EmployeeManagement() {
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);
  const [showModal, setShowModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', team: '', department: '', process: '' });

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.team) {
      setEmployees([...employees, { id: employees.length + 1, ...newEmployee, kpis: [] }]);
      setNewEmployee({ name: '', team: '', department: '', process: '' });
      setShowModal(false);
    }
  };

  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: COLORS.text }}>Employee Management</h2>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '8px 16px',
            background: COLORS.secondary,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Plus size={16} /> Add Employee
        </button>
      </div>

      <div style={{ overflowX: 'auto', background: 'white', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: COLORS.light, borderBottom: `1px solid ${COLORS.border}` }}>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.text }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.text }}>Team</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.text }}>Department</th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.text }}>Process</th>
              <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: COLORS.text }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: '12px', fontSize: '14px', color: COLORS.text, fontWeight: '500' }}>{emp.name}</td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>{emp.team}</td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>{emp.department}</td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>{emp.process}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleDeleteEmployee(emp.id)}
                    style={{ background: 'none', border: 'none', color: COLORS.danger, cursor: 'pointer' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: COLORS.text }}>Add New Employee</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block', color: COLORS.text }}>Name</label>
              <input
                type="text"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block', color: COLORS.text }}>Team</label>
              <input
                type="text"
                value={newEmployee.team}
                onChange={(e) => setNewEmployee({ ...newEmployee, team: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block', color: COLORS.text }}>Department</label>
              <input
                type="text"
                value={newEmployee.department}
                onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block', color: COLORS.text }}>Process</label>
              <input
                type="text"
                value={newEmployee.process}
                onChange={(e) => setNewEmployee({ ...newEmployee, process: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleAddEmployee}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: COLORS.secondary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Add Employee
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: COLORS.light,
                  color: COLORS.text,
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// KPI Management Module
function KPIManagement() {
  const [kpis, setKpis] = useState(MOCK_KPIS);
  const [showModal, setShowModal] = useState(false);
  const [newKPI, setNewKPI] = useState({ name: '', formula: '', unit: '', weight: 0, threshold: 0 });
  const [editingId, setEditingId] = useState(null);

  const handleAddKPI = () => {
    if (newKPI.name && newKPI.formula) {
      if (editingId) {
        setKpis(kpis.map(k => k.id === editingId ? { ...newKPI, id: editingId } : k));
        setEditingId(null);
      } else {
        setKpis([...kpis, { id: kpis.length + 1, ...newKPI }]);
      }
      setNewKPI({ name: '', formula: '', unit: '', weight: 0, threshold: 0 });
      setShowModal(false);
    }
  };

  const handleEditKPI = (kpi) => {
    setNewKPI(kpi);
    setEditingId(kpi.id);
    setShowModal(true);
  };

  const handleDeleteKPI = (id) => {
    setKpis(kpis.filter(k => k.id !== id));
  };

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: COLORS.text }}>KPI Management</h2>
        <button
          onClick={() => { setEditingId(null); setNewKPI({ name: '', formula: '', unit: '', weight: 0, threshold: 0 }); setShowModal(true); }}
          style={{
            padding: '8px 16px',
            background: COLORS.secondary,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Plus size={16} /> Add KPI
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {kpis.map(kpi => (
          <div key={kpi.id} style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: `1px solid ${COLORS.border}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: COLORS.text }}>{kpi.name}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleEditKPI(kpi)}
                  style={{ background: 'none', border: 'none', color: COLORS.secondary, cursor: 'pointer' }}
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteKPI(kpi.id)}
                  style={{ background: 'none', border: 'none', color: COLORS.danger, cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px', fontFamily: 'monospace', background: COLORS.light, padding: '8px', borderRadius: '4px' }}>
              {kpi.formula}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${COLORS.border}` }}>
              <div>
                <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600' }}>UNIT</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.text }}>{kpi.unit}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600' }}>WEIGHT</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.text }}>{kpi.weight}%</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600' }}>THRESHOLD</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.text }}>{kpi.threshold}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          overflowY: 'auto'
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '450px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            margin: '20px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: COLORS.text }}>
              {editingId ? 'Edit KPI' : 'Add New KPI'}
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block', color: COLORS.text }}>KPI Name</label>
              <input
                type="text"
                value={newKPI.name}
                onChange={(e) => setNewKPI({ ...newKPI, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block', color: COLORS.text }}>Formula</label>
              <textarea
                value={newKPI.formula}
                onChange={(e) => setNewKPI({ ...newKPI, formula: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  fontFamily: 'monospace',
                  minHeight: '60px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block', color: COLORS.text }}>Unit</label>
                <input
                  type="text"
                  value={newKPI.unit}
                  onChange={(e) => setNewKPI({ ...newKPI, unit: e.target.value })}
                  placeholder="e.g., $, %, hrs"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block', color: COLORS.text }}>Weight (%)</label>
                <input
                  type="number"
                  value={newKPI.weight}
                  onChange={(e) => setNewKPI({ ...newKPI, weight: parseFloat(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block', color: COLORS.text }}>Threshold</label>
              <input
                type="number"
                value={newKPI.threshold}
                onChange={(e) => setNewKPI({ ...newKPI, threshold: parseFloat(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleAddKPI}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: COLORS.secondary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                {editingId ? 'Update KPI' : 'Add KPI'}
              </button>
              <button
                onClick={() => { setShowModal(false); setEditingId(null); }}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: COLORS.light,
                  color: COLORS.text,
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Performance Tracking Module
function PerformanceTracking() {
  const [selectedEmployee, setSelectedEmployee] = useState(MOCK_EMPLOYEES[0]);
  const employeePerformance = MOCK_PERFORMANCE_DATA.filter(d => d.employee === selectedEmployee.name);

  // Monthly summary
  const monthlySummary = [
    { month: 'Jan', score: 88 },
    { month: 'Dec', score: 82 },
    { month: 'Nov', score: 79 },
    { month: 'Oct', score: 75 },
    { month: 'Sep', score: 78 },
    { month: 'Aug', score: 81 }
  ];

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: COLORS.text, marginBottom: '24px' }}>Performance Tracking</h2>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', display: 'block', color: COLORS.text }}>Select Employee</label>
        <select
          value={selectedEmployee.id}
          onChange={(e) => setSelectedEmployee(MOCK_EMPLOYEES.find(emp => emp.id === parseInt(e.target.value)))}
          style={{
            padding: '10px 12px',
            border: `1px solid ${COLORS.border}`,
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            width: '100%',
            maxWidth: '300px'
          }}
        >
          {MOCK_EMPLOYEES.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '8px' }}>Current Score</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: COLORS.secondary }}>{employeePerformance[0]?.score || 0}</div>
          <div style={{ fontSize: '12px', color: COLORS.accent, marginTop: '8px' }}>↑ 6 points from last week</div>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '8px' }}>Average (30 days)</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: COLORS.text }}>{Math.round(employeePerformance.reduce((a, p) => a + p.score, 0) / Math.max(1, employeePerformance.length))}</div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>Based on {employeePerformance.length} records</div>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '8px' }}>Status</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <CheckCircle size={24} color={COLORS.accent} />
            <div style={{ fontSize: '16px', fontWeight: '600', color: COLORS.accent }}>On Track</div>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: `1px solid ${COLORS.border}`, marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: COLORS.text, marginBottom: '16px' }}>Monthly Performance Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlySummary}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" stroke={COLORS.secondary} strokeWidth={2} dot={{ fill: COLORS.secondary, r: 5 }} activeDot={{ r: 7 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: COLORS.text, marginBottom: '16px' }}>Recent KPI Records</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: COLORS.light, borderBottom: `1px solid ${COLORS.border}` }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.text }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.text }}>KPI</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.text }}>Value</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: COLORS.text }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {employeePerformance.map((record, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: '12px', fontSize: '13px', color: COLORS.text }}>{record.date}</td>
                  <td style={{ padding: '12px', fontSize: '13px', color: '#6b7280' }}>Revenue Generated</td>
                  <td style={{ padding: '12px', fontSize: '13px', color: COLORS.text, fontWeight: '500' }}>${record['Revenue Generated']}</td>
                  <td style={{ padding: '12px', fontSize: '13px', color: COLORS.secondary, fontWeight: '600' }}>{record.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Coaching Module
function CoachingModule() {
  const [feedbackList, setFeedbackList] = useState(MOCK_FEEDBACK);
  const [improvementPlans, setImprovementPlans] = useState(MOCK_IMPROVEMENT_PLANS);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [newFeedback, setNewFeedback] = useState({ employeeId: 1, comment: '', type: 'Positive' });
  const [newPlan, setNewPlan] = useState({ employeeId: 1, title: '', goal: '', dueDate: '', status: 'In Progress' });

  const handleAddFeedback = () => {
    if (newFeedback.comment) {
      setFeedbackList([...feedbackList, {
        id: feedbackList.length + 1,
        ...newFeedback,
        from: 'Current User',
        date: new Date().toISOString().split('T')[0]
      }]);
      setNewFeedback({ employeeId: 1, comment: '', type: 'Positive' });
      setShowFeedbackModal(false);
    }
  };

  const handleAddPlan = () => {
    if (newPlan.title && newPlan.goal) {
      setImprovementPlans([...improvementPlans, {
        id: improvementPlans.length + 1,
        ...newPlan,
        progress: 0
      }]);
      setNewPlan({ employeeId: 1, title: '', goal: '', dueDate: '', status: 'In Progress' });
      setShowPlanModal(false);
    }
  };

  const handleDeleteFeedback = (id) => {
    setFeedbackList(feedbackList.filter(f => f.id !== id));
  };

  const handleDeletePlan = (id) => {
    setImprovementPlans(improvementPlans.filter(p => p.id !== id));
  };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: COLORS.text, marginBottom: '24px' }}>Coaching & Development</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {/* Feedback Section */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: COLORS.text }}>Performance Feedback</h3>
            <button
              onClick={() => setShowFeedbackModal(true)}
              style={{
                padding: '6px 12px',
                background: COLORS.secondary,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
              <Plus size={14} style={{ display: 'inline', marginRight: '4px' }} /> Add
            </button>
          </div>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {feedbackList.map(feedback => (
              <div key={feedback.id} style={{
                padding: '12px',
                marginBottom: '12px',
                background: feedback.type === 'Positive' ? '#f0fdf4' : '#fffbeb',
                borderLeft: `4px solid ${feedback.type === 'Positive' ? COLORS.accent : COLORS.warning}`,
                borderRadius: '4px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '6px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: COLORS.text }}>{feedback.from}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{feedback.date}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteFeedback(feedback.id)}
                    style={{ background: 'none', border: 'none', color: COLORS.danger, cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div style={{ fontSize: '12px', color: COLORS.text, marginTop: '8px', lineHeight: '1.4' }}>
                  {feedback.comment}
                </div>
                <div style={{
                  marginTop: '8px',
                  display: 'inline-block',
                  padding: '2px 8px',
                  background: feedback.type === 'Positive' ? '#dcfce7' : '#fef3c7',
                  color: feedback.type === 'Positive' ? COLORS.accent : COLORS.warning,
                  fontSize: '10px',
                  fontWeight: '600',
                  borderRadius: '3px'
                }}>
                  {feedback.type}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Improvement Plans Section */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: COLORS.text }}>Improvement Plans</h3>
            <button
              onClick={() => setShowPlanModal(true)}
              style={{
                padding: '6px 12px',
                background: COLORS.secondary,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
              <Plus size={14} style={{ display: 'inline', marginRight: '4px' }} /> Add
            </button>
          </div>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {improvementPlans.map(plan => (
              <div key={plan.id} style={{
                padding: '12px',
                marginBottom: '12px',
                background: COLORS.light,
                borderRadius: '4px',
                border: `1px solid ${COLORS.border}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: COLORS.text }}>{plan.title}</div>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    style={{ background: 'none', border: 'none', color: COLORS.danger, cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px' }}>{plan.goal}</div>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>Progress: {plan.progress}%</div>
                  <div style={{ width: '100%', height: '6px', background: COLORS.border, borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${plan.progress}%`, height: '100%', background: COLORS.accent, transition: 'width 0.3s' }}></div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#6b7280' }}>
                  <span>Due: {plan.dueDate}</span>
                  <span style={{
                    padding: '2px 6px',
                    background: plan.status === 'Completed' ? '#dcfce7' : '#fef3c7',
                    color: plan.status === 'Completed' ? COLORS.accent : COLORS.warning,
                    borderRadius: '2px',
                    fontWeight: '600'
                  }}>
                    {plan.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '450px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: COLORS.text }}>Add Feedback</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block', color: COLORS.text }}>Employee</label>
              <select
                value={newFeedback.employeeId}
                onChange={(e) => setNewFeedback({ ...newFeedback, employeeId: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
                }}
              >
                {MOCK_EMPLOYEES.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block', color: COLORS.text }}>Feedback Type</label>
              <select
                value={newFeedback.type}
                onChange={(e) => setNewFeedback({ ...newFeedback, type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
                }}
              >
                <option>Positive</option>
                <option>Constructive</option>
                <option>Developmental</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block', color: COLORS.text }}>Comment</label>
              <textarea
                value={newFeedback.comment}
                onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                placeholder="Enter your feedback..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  minHeight: '100px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleAddFeedback}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: COLORS.secondary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Add Feedback
              </button>
              <button
                onClick={() => setShowFeedbackModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: COLORS.light,
                  color: COLORS.text,
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Improvement Plan Modal */}
      {showPlanModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          overflowY: 'auto'
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '450px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            margin: '20px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: COLORS.text }}>Create Improvement Plan</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block', color: COLORS.text }}>Employee</label>
              <select
                value={newPlan.employeeId}
                onChange={(e) => setNewPlan({ ...newPlan, employeeId: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
                }}
              >
                {MOCK_EMPLOYEES.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block', color: COLORS.text }}>Plan Title</label>
              <input
                type="text"
                value={newPlan.title}
                onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block', color: COLORS.text }}>Goal</label>
              <textarea
                value={newPlan.goal}
                onChange={(e) => setNewPlan({ ...newPlan, goal: e.target.value })}
                placeholder="Describe the improvement goal..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  minHeight: '80px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px', display: 'block', color: COLORS.text }}>Due Date</label>
              <input
                type="date"
                value={newPlan.dueDate}
                onChange={(e) => setNewPlan({ ...newPlan, dueDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleAddPlan}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: COLORS.secondary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Create Plan
              </button>
              <button
                onClick={() => setShowPlanModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: COLORS.light,
                  color: COLORS.text,
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Dashboard
function Dashboard() {
  const stats = [
    { label: 'Total Employees', value: '24', icon: Users, color: COLORS.secondary },
    { label: 'Active KPIs', value: '7', icon: Target, color: COLORS.accent },
    { label: 'Avg Performance', value: '84%', icon: TrendingUp, color: COLORS.warning },
    { label: 'Improvement Plans', value: '12', icon: BookOpen, color: '#8b5cf6' }
  ];

  const performanceData = [
    { name: 'Excellent', value: 8 },
    { name: 'Good', value: 12 },
    { name: 'Average', value: 3 },
    { name: 'Needs Improvement', value: 1 }
  ];

  const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: '700', color: COLORS.text, marginBottom: '24px' }}>Dashboard</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              border: `1px solid ${COLORS.border}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '8px' }}>{stat.label}</div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
                </div>
                <Icon size={28} color={stat.color} opacity={0.2} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: COLORS.text, marginBottom: '16px' }}>Performance Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={performanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: COLORS.text, marginBottom: '16px' }}>Monthly Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { month: 'Jan', performance: 82 },
              { month: 'Feb', performance: 85 },
              { month: 'Mar', performance: 88 },
              { month: 'Apr', performance: 86 },
              { month: 'May', performance: 90 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="performance" fill={COLORS.secondary} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
      case 'performance': return <PerformanceTracking />;
      case 'coaching': return <CoachingModule />;
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
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{APP_NAME}</div>
          <div style={{ fontSize: '12px', color: '#d1d5db' }}>Performance Management</div>
        </div>

        <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
          {modules.map(module => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: activeModule === module.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: 'white',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeModule === module.id ? '600' : '500',
                  borderLeft: activeModule === module.id ? `4px solid ${COLORS.secondary}` : '4px solid transparent',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = activeModule === module.id ? 'rgba(255,255,255,0.15)' : 'transparent';
                }}
              >
                <Icon size={18} />
                <span>{module.name}</span>
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          padding: '16px 24px',
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: COLORS.text,
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.text }}>{currentUser?.email}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>{currentUser?.role}</div>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: COLORS.secondary,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '16px'
            }}>
              {currentUser?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {renderModule()}
        </div>
      </div>
    </div>
  );
}
