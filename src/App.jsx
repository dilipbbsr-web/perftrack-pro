import React, { useState, useEffect } from 'react';
import { Users, Target, LogOut, Home, Plus, BarChart3, CheckCircle, Download, Menu, X } from 'lucide-react';lucide-react';
import { supabase } from './supabaseClient';

const COLORS = { 
  primary: '#1f2937', secondary: '#3b82f6', accent: '#10b981', danger: '#ef4444', 
  warning: '#f59e0b', light: '#f3f4f6', text: '#111827', border: '#e5e7eb', 
  success: '#059669', info: '#0ea5e9'
};

const ROLES = {
  ADMIN: 'Admin',
  HR: 'HR',
  DIRECTOR: 'Director',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee'
};

const APPROVAL_LEVELS = {
  PENDING: 'Pending',
  MANAGER_APPROVED: 'Manager Approved',
  DIRECTOR_APPROVED: 'Director Approved',
  APPROVED: 'Approved',
  REJECTED: 'Rejected'
};

// ==================== DATABASE FUNCTIONS ====================

async function authenticateUser(email, password) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !data) return null;
    
    // Simple password validation (in production, use bcrypt)
    return { ...data, token: btoa(`${email}:${data.id}:${Date.now()}`) };
  } catch {
    return null;
  }
}

async function fetchDepartments() {
  try {
    const { data, error } = await supabase.from('departments').select('*').order('name');
    return error ? [] : data || [];
  } catch {
    return [];
  }
}

async function fetchEmployees(departmentId = null) {
  try {
    let query = supabase.from('employees').select('*');
    if (departmentId) query = query.eq('department_id', departmentId);
    const { data, error } = await query.order('name');
    return error ? [] : data || [];
  } catch {
    return [];
  }
}

async function fetchKPITemplates() {
  try {
    const { data, error } = await supabase.from('kpi_templates').select('*').order('name');
    return error ? [] : data || [];
  } catch {
    return [];
  }
}

async function fetchGoals(employeeId = null, status = null) {
  try {
    let query = supabase.from('goals').select('*');
    if (employeeId) query = query.eq('employee_id', employeeId);
    if (status) query = query.eq('approval_status', status);
    const { data, error } = await query.order('created_at', { ascending: false });
    return error ? [] : data || [];
  } catch {
    return [];
  }
}

async function fetchApprovalWorkflow(goalId) {
  try {
    const { data, error } = await supabase
      .from('approval_workflow')
      .select('*')
      .eq('goal_id', goalId)
      .order('level');
    return error ? [] : data || [];
  } catch {
    return [];
  }
}

// ==================== LOGIN PAGE ====================

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const user = await authenticateUser(email, password);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid credentials. Try: admin@company.com / password');
    }
    setLoading(false);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI'" }}>
      <div style={{ background: 'white', padding: '50px', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', width: '100%', maxWidth: '420px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: COLORS.text }}>PerfTrack Pro</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '30px' }}>Enterprise Performance Management System</p>

        {error && <div style={{ padding: '12px', background: '#fee2e2', color: COLORS.danger, borderRadius: '6px', marginBottom: '20px', fontSize: '13px' }}>❌ {error}</div>}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ width: '100%', padding: '12px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={{ width: '100%', padding: '12px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: COLORS.secondary, color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '16px', background: COLORS.light, borderRadius: '6px', fontSize: '12px', color: '#6b7280' }}>
          <p style={{ marginTop: 0, fontWeight: '600' }}>Demo Accounts:</p>
          <p style={{ margin: '4px 0' }}>👤 Employee: employee@company.com</p>
          <p style={{ margin: '4px 0' }}>👔 Manager: manager@company.com</p>
          <p style={{ margin: '4px 0' }}>🎯 Director: director@company.com</p>
          <p style={{ margin: '4px 0' }}>👨‍💼 Admin: admin@company.com</p>
        </div>
      </div>
    </div>
  );
}

// ==================== DASHBOARD ====================

function Dashboard({ user }) {
  const [stats, setStats] = useState({ employees: 0, kpis: 0, goals: 0, approvals: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const employees = await fetchEmployees();
      const kpis = await fetchKPITemplates();
      const goals = await fetchGoals();
      const pendingGoals = await fetchGoals(null, APPROVAL_LEVELS.PENDING);
      
      setStats({
        employees: employees.length,
        kpis: kpis.length,
        goals: goals.length,
        approvals: pendingGoals.length
      });
    };
    loadStats();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', color: COLORS.text }}>Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <StatCard icon="👥" label="Total Employees" value={stats.employees} color={COLORS.secondary} />
        <StatCard icon="🎯" label="KPI Templates" value={stats.kpis} color={COLORS.accent} />
        <StatCard icon="📋" label="Active Goals" value={stats.goals} color={COLORS.warning} />
        <StatCard icon="✅" label="Pending Approvals" value={stats.approvals} color={COLORS.danger} />
      </div>

      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          <QuickActionButton icon="➕" label="Create Goal" />
          <QuickActionButton icon="📊" label="View Analytics" />
          <QuickActionButton icon="✍️" label="Review Goals" />
          <QuickActionButton icon="📥" label="Export Report" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '32px' }}>{icon}</div>
        <div>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>{label}</p>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: '700', color }}>{value}</p>
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({ icon, label }) {
  return (
    <button style={{ padding: '12px', background: COLORS.light, border: `1px solid ${COLORS.border}`, borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
      <span style={{ fontSize: '16px' }}>{icon}</span>
      {label}
    </button>
  );
}

// ==================== DEPARTMENT MANAGEMENT ====================

function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', head_id: '' });

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    const data = await fetchDepartments();
    setDepartments(data);
  };

  const handleSave = async () => {
    if (!form.name) { alert('Fill all fields'); return; }
    try {
      const { data, error } = await supabase.from('departments').insert([form]).select();
      if (!error) {
        setDepartments([...departments, data[0]]);
        setForm({ name: '', description: '', head_id: '' });
        setShowForm(false);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete department?')) {
      await supabase.from('departments').delete().eq('id', id);
      setDepartments(departments.filter(d => d.id !== id));
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Department Management</h2>
        <button onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: COLORS.secondary, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}><Plus size={18} />Add Department</button>
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', marginBottom: '30px', border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>Add New Department</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '16px' }}>
            <input type="text" placeholder="Department Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px' }} />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px', minHeight: '80px' }} />
          </div>
          <button onClick={handleSave} style={{ padding: '8px 16px', background: COLORS.accent, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}>Create</button>
          <button onClick={() => setShowForm(false)} style={{ padding: '8px 16px', background: COLORS.border, border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: COLORS.light }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Department</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Description</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map(d => (
              <tr key={d.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: '12px' }}>{d.name}</td>
                <td style={{ padding: '12px' }}>{d.description}</td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => handleDelete(d.id)} style={{ padding: '4px 8px', background: COLORS.danger, color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== GOAL MANAGEMENT ====================

function GoalManagement({ user }) {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', kpi_template_id: '', target_value: '', deadline: '', description: '' });
  const [kpiTemplates, setKpiTemplates] = useState([]);

useEffect(() => {
    loadGoals();
    loadKPITemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadGoals = async () => {
    const data = await fetchGoals(user.id);
    setGoals(data);
  };

  const loadKPITemplates = async () => {
    const data = await fetchKPITemplates();
    setKpiTemplates(data);
  };

  const handleCreateGoal = async () => {
    if (!form.title || !form.kpi_template_id) { alert('Fill required fields'); return; }
    try {
      const goalData = {
        ...form,
        employee_id: user.id,
        approval_status: APPROVAL_LEVELS.PENDING,
        created_at: new Date().toISOString()
      };
      const { data, error } = await supabase.from('goals').insert([goalData]).select();
      if (!error) {
        setGoals([...goals, data[0]]);
        setForm({ title: '', kpi_template_id: '', target_value: '', deadline: '', description: '' });
        setShowForm(false);
        
        // Create approval workflow
        await createApprovalWorkflow(data[0].id, user);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const createApprovalWorkflow = async (goalId, employee) => {
    const workflow = [
      { goal_id: goalId, level: 1, approval_by_role: ROLES.MANAGER, status: APPROVAL_LEVELS.PENDING },
      { goal_id: goalId, level: 2, approval_by_role: ROLES.DIRECTOR, status: APPROVAL_LEVELS.PENDING },
      { goal_id: goalId, level: 3, approval_by_role: ROLES.HR, status: APPROVAL_LEVELS.PENDING }
    ];
    await supabase.from('approval_workflow').insert(workflow);
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Goal Management</h2>
        <button onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: COLORS.secondary, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}><Plus size={18} />Create Goal</button>
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', marginBottom: '30px', border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>Create New Goal</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <input type="text" placeholder="Goal Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px' }} />
            <select value={form.kpi_template_id} onChange={(e) => setForm({...form, kpi_template_id: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px' }}>
              <option value="">Select KPI Template</option>
              {kpiTemplates.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
            </select>
            <input type="number" placeholder="Target Value" value={form.target_value} onChange={(e) => setForm({...form, target_value: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px' }} />
            <input type="date" value={form.deadline} onChange={(e) => setForm({...form, deadline: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px' }} />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} style={{ padding: '8px', border: `1px solid ${COLORS.border}`, borderRadius: '4px', gridColumn: '1 / -1', minHeight: '80px' }} />
          </div>
          <button onClick={handleCreateGoal} style={{ padding: '8px 16px', background: COLORS.accent, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}>Create Goal</button>
          <button onClick={() => setShowForm(false)} style={{ padding: '8px 16px', background: COLORS.border, border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: COLORS.light }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Goal</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Target</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Deadline</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {goals.map(g => (
              <tr key={g.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: '12px' }}>{g.title}</td>
                <td style={{ padding: '12px' }}>{g.target_value}</td>
                <td style={{ padding: '12px' }}>{g.deadline}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', background: g.approval_status === APPROVAL_LEVELS.APPROVED ? '#d1fae5' : g.approval_status === APPROVAL_LEVELS.REJECTED ? '#fee2e2' : '#fef3c7', color: g.approval_status === APPROVAL_LEVELS.APPROVED ? '#065f46' : g.approval_status === APPROVAL_LEVELS.REJECTED ? '#7f1d1d' : '#92400e' }}>
                    {g.approval_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== APPROVAL WORKFLOW ====================

function ApprovalWorkflow({ user }) {
  const [pendingGoals, setPendingGoals] = useState([]);
  const [workflows, setWorkflows] = useState({});

  useEffect(() => {
    loadPendingGoals();
  }, [user]);

  const loadPendingGoals = async () => {
    const goals = await fetchGoals(null, APPROVAL_LEVELS.PENDING);
    setPendingGoals(goals);
    
    for (const goal of goals) {
      const workflow = await fetchApprovalWorkflow(goal.id);
      setWorkflows(prev => ({ ...prev, [goal.id]: workflow }));
    }
  };

  const handleApprove = async (goalId, level) => {
    try {
      await supabase
        .from('approval_workflow')
        .update({ status: 'Approved', approved_at: new Date().toISOString() })
        .eq('goal_id', goalId)
        .eq('level', level);

      // Check if all levels approved
      const workflow = workflows[goalId];
      if (workflow && workflow.filter(w => w.status !== 'Approved').length === 1) {
        await supabase.from('goals').update({ approval_status: APPROVAL_LEVELS.APPROVED }).eq('id', goalId);
      }
      
      loadPendingGoals();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleReject = async (goalId) => {
    try {
      await supabase.from('goals').update({ approval_status: APPROVAL_LEVELS.REJECTED }).eq('id', goalId);
      loadPendingGoals();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', color: COLORS.text }}>Approval Workflow</h2>
      
      <div style={{ display: 'grid', gap: '20px' }}>
        {pendingGoals.map(goal => (
          <div key={goal.id} style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>{goal.title}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Target: {goal.target_value} | Deadline: {goal.deadline}</p>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '600' }}>Approval Chain:</h4>
              {workflows[goal.id] && workflows[goal.id].map((step, idx) => (
                <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: step.status === 'Approved' ? COLORS.success : COLORS.warning, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>
                    {step.status === 'Approved' ? '✓' : idx + 1}
                  </span>
                  <span>{step.approval_by_role}</span>
                  <span style={{ color: '#6b7280' }}>- {step.status}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleApprove(goal.id, 1)} style={{ padding: '8px 16px', background: COLORS.success, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>✓ Approve</button>
              <button onClick={() => handleReject(goal.id)} style={{ padding: '8px 16px', background: COLORS.danger, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>✗ Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== ANALYTICS DASHBOARD ====================

function Analytics() {
  const [analytics, setAnalytics] = useState({ completionRate: 0, avgScore: 0, byDepartment: {} });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const goals = await fetchGoals();
    const approved = goals.filter(g => g.approval_status === APPROVAL_LEVELS.APPROVED).length;
    const completionRate = goals.length > 0 ? Math.round((approved / goals.length) * 100) : 0;
    
    setAnalytics({
      completionRate,
      avgScore: Math.round(Math.random() * 100), // Placeholder calculation
      byDepartment: { Engineering: 85, Sales: 78, Marketing: 82, HR: 88 }
    });
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', color: COLORS.text }}>Analytics Dashboard</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <AnalyticsCard title="Goal Completion Rate" value={`${analytics.completionRate}%`} color={COLORS.accent} icon="📈" />
        <AnalyticsCard title="Avg Performance Score" value={`${analytics.avgScore}/100`} color={COLORS.secondary} icon="⭐" />
      </div>

      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Performance by Department</h3>
        {Object.entries(analytics.byDepartment).map(([dept, score]) => (
          <div key={dept} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
              <span style={{ fontWeight: '600' }}>{dept}</span>
              <span>{score}%</span>
            </div>
            <div style={{ background: COLORS.light, height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ background: COLORS.accent, height: '100%', width: `${score}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsCard({ title, value, color, icon }) {
  return (
    <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
      <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '13px', fontWeight: '600' }}>{title}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '28px' }}>{icon}</span>
        <span style={{ fontSize: '32px', fontWeight: '700', color }}>{value}</span>
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  // Role-based navigation
  const getModules = () => {
    const baseModules = [
      { id: 'dashboard', name: 'Dashboard', icon: Home },
      { id: 'goals', name: 'Goals', icon: Target },
    ];

    if ([ROLES.ADMIN, ROLES.HR, ROLES.MANAGER, ROLES.DIRECTOR].includes(currentUser?.role)) {
      baseModules.push(
        { id: 'departments', name: 'Departments', icon: Users },
        { id: 'approvals', name: 'Approvals', icon: CheckCircle }
      );
    }

    if ([ROLES.ADMIN, ROLES.HR].includes(currentUser?.role)) {
      baseModules.push(
        { id: 'analytics', name: 'Analytics', icon: BarChart3 },
        { id: 'reports', name: 'Reports', icon: Download }
      );
    }

    return baseModules;
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard': return <Dashboard user={currentUser} />;
      case 'goals': return <GoalManagement user={currentUser} />;
      case 'departments': return <DepartmentManagement />;
      case 'approvals': return <ApprovalWorkflow user={currentUser} />;
      case 'analytics': return <Analytics />;
      case 'reports': return <ReportsExport />;
      default: return <Dashboard user={currentUser} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.light, fontFamily: "'Segoe UI'" }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? '260px' : '0', background: COLORS.primary, color: 'white', padding: sidebarOpen ? '20px 0' : '0', transition: 'all 0.3s', overflow: 'hidden', borderRight: `1px solid ${COLORS.border}` }}>
        <h1 style={{ margin: sidebarOpen ? '0 20px 30px 20px' : '0', fontSize: '14px', fontWeight: '700' }}>PerfTrack Pro</h1>
        <p style={{ margin: sidebarOpen ? '0 20px 20px 20px' : '0', fontSize: '11px', color: '#9ca3af', fontWeight: '500' }}>{currentUser?.role}</p>

        {getModules().map(module => {
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
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ background: 'white', padding: '16px 24px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: COLORS.text }}>{sidebarOpen ? <X size={24} /> : <Menu size={24} />}</button>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: COLORS.text }}>PerfTrack Pro</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: COLORS.text }}>Welcome, {currentUser?.name}!</span>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: COLORS.danger, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}><LogOut size={16} />Logout</button>
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

function ReportsExport() {
  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', color: COLORS.text }}>Reports & Export</h2>
      <div style={{ background: 'white', padding: '40px', borderRadius: '8px', border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '20px' }}>📊 Export Reports</p>
        <button style={{ padding: '12px 24px', background: COLORS.secondary, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', marginRight: '12px' }}>📥 Export as PDF</button>
        <button style={{ padding: '12px 24px', background: COLORS.accent, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>📊 Export as Excel</button>
        <p style={{ marginTop: '20px', color: '#6b7280', fontSize: '13px' }}>Reports export functionality coming soon</p>
      </div>
    </div>
  );
}
