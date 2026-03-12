import React, { useState, useEffect } from 'react';
import { Users, Target, LogOut, Home, Plus, BarChart3, TrendingUp, AlertCircle, Download, Menu, X, Award, PieChart } from 'lucide-react';
import { supabase } from './supabaseClient';

const COLORS = { 
  primary: '#1f2937', secondary: '#3b82f6', accent: '#10b981', danger: '#ef4444', 
  warning: '#f59e0b', light: '#f3f4f6', text: '#111827', border: '#e5e7eb', 
  success: '#059669', info: '#0ea5e9'
};

// ==================== COMPREHENSIVE KPI LIBRARY ====================

const KPI_LIBRARY = {
  HR: [
    { id: 'hr_1', name: 'Employee Satisfaction Score', unit: '%', target: 85, weight: 15 },
    { id: 'hr_2', name: 'Engagement Index', unit: 'score', target: 75, weight: 15 },
    { id: 'hr_3', name: 'Internal Promotion Rate', unit: '%', target: 20, weight: 10 },
    { id: 'hr_4', name: 'Absenteeism Rate', unit: '%', target: 5, weight: 10 },
    { id: 'hr_5', name: 'Employee Retention Rate', unit: '%', target: 90, weight: 20 },
  ],
  Development: [
    { id: 'dev_1', name: 'Sprint Completion Rate', unit: '%', target: 95, weight: 25 },
    { id: 'dev_2', name: 'Code Quality Score', unit: '%', target: 90, weight: 20 },
    { id: 'dev_3', name: 'Bug Density', unit: 'per KLOC', target: 2, weight: 15 },
    { id: 'dev_4', name: 'Test Coverage', unit: '%', target: 85, weight: 20 },
    { id: 'dev_5', name: 'Deployment Success Rate', unit: '%', target: 98, weight: 20 },
  ],
  Sales: [
    { id: 'sales_1', name: 'Revenue Growth', unit: '%', target: 25, weight: 30 },
    { id: 'sales_2', name: 'Lead Conversion Rate', unit: '%', target: 30, weight: 25 },
    { id: 'sales_3', name: 'Customer Acquisition Cost', unit: '$', target: 500, weight: 15 },
    { id: 'sales_4', name: 'Customer Lifetime Value', unit: '$', target: 5000, weight: 20 },
    { id: 'sales_5', name: 'Sales Target Achievement', unit: '%', target: 100, weight: 10 },
  ],
  IT: [
    { id: 'it_1', name: 'System Uptime', unit: '%', target: 99.9, weight: 30 },
    { id: 'it_2', name: 'Incident Resolution Time', unit: 'hours', target: 4, weight: 25 },
    { id: 'it_3', name: 'Security Audit Score', unit: '%', target: 95, weight: 25 },
    { id: 'it_4', name: 'Patch Compliance Rate', unit: '%', target: 100, weight: 20 },
  ],
  Support: [
    { id: 'support_1', name: 'First Call Resolution', unit: '%', target: 85, weight: 30 },
    { id: 'support_2', name: 'Customer Satisfaction', unit: '%', target: 90, weight: 30 },
    { id: 'support_3', name: 'Avg Response Time', unit: 'minutes', target: 5, weight: 20 },
    { id: 'support_4', name: 'Ticket Backlog', unit: 'count', target: 10, weight: 20 },
  ],
};

const PERFORMANCE_GRADES = {
  90: 'Outstanding',
  80: 'Excellent',
  70: 'Good',
  60: 'Average',
  0: 'Needs Improvement'
};

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

    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (fetchError || !data) {
        setError('Invalid credentials');
        setLoading(false);
        return;
      }

      onLogin({ ...data, token: btoa(`${email}:${data.id}:${Date.now()}`) });
    } catch {
      setError('Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI'" }}>
      <div style={{ background: 'white', padding: '50px', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', width: '100%', maxWidth: '420px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: COLORS.text }}>PerfTrack Pro</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '30px' }}>Enterprise KPI Performance System</p>

        {error && <div style={{ padding: '12px', background: '#fee2e2', color: COLORS.danger, borderRadius: '6px', marginBottom: '20px', fontSize: '13px' }}>❌ {error}</div>}

        <form onSubmit={handleLogin}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ width: '100%', padding: '12px', marginBottom: '12px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={{ width: '100%', padding: '12px', marginBottom: '24px', border: `1px solid ${COLORS.border}`, borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: COLORS.secondary, color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ==================== PERFORMANCE CALCULATOR ENGINE ====================

function calculatePerformanceScore(employee, kpis) {
  if (!kpis || kpis.length === 0) return 0;

  let totalScore = 0;
  let totalWeight = 0;

  kpis.forEach(kpi => {
    const achievement = (kpi.actual / kpi.target) * 100;
    const cappedAchievement = Math.min(achievement, 120); // Cap at 120%
    const weightedScore = (cappedAchievement * kpi.weight) / 100;
    totalScore += weightedScore;
    totalWeight += kpi.weight;
  });

  return totalWeight > 0 ? Math.round(totalScore / totalWeight * 10) / 10 : 0;
}

function getGrade(score) {
  if (score >= 90) return { grade: 'Outstanding', color: '#059669' };
  if (score >= 80) return { grade: 'Excellent', color: '#3b82f6' };
  if (score >= 70) return { grade: 'Good', color: '#f59e0b' };
  if (score >= 60) return { grade: 'Average', color: '#ef4444' };
  return { grade: 'Needs Improvement', color: '#7f1d1d' };
}

// ==================== DASHBOARD ====================

function Dashboard({ user }) {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeGoals: 0,
    avgPerformance: 0,
    topPerformer: null
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const { data: employees } = await supabase.from('employees').select('*');
      const { data: goals } = await supabase.from('goals').select('*').eq('approval_status', 'Approved');
      
      setStats({
        totalEmployees: employees?.length || 0,
        activeGoals: goals?.length || 0,
        avgPerformance: Math.round(Math.random() * 40 + 70), // Placeholder
        topPerformer: 'Rahul Sharma'
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '30px', color: COLORS.text }}>📊 Executive Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <StatCard label="Total Employees" value={stats.totalEmployees} icon="👥" />
        <StatCard label="Active Goals" value={stats.activeGoals} icon="🎯" />
        <StatCard label="Avg Performance" value={`${stats.avgPerformance}%`} icon="📈" />
        <StatCard label="Top Performer" value={stats.topPerformer} icon="⭐" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>📊 Department Performance</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {['Sales: 88%', 'Development: 85%', 'HR: 82%', 'IT: 79%', 'Support: 75%'].map((dept, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>{dept.split(':')[0]}</span>
                <div style={{ background: COLORS.light, height: '8px', width: '120px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ background: COLORS.accent, height: '100%', width: `${parseInt(dept.split(':')[1])}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>🚨 Alerts</h3>
          <div style={{ display: 'grid', gap: '8px', fontSize: '12px' }}>
            <AlertItem text="5 goals approaching deadline" />
            <AlertItem text="2 employees below target" />
            <AlertItem text="3 pending approvals" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '32px' }}>{icon}</span>
        <div>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>{label}</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: COLORS.secondary }}>{value}</p>
        </div>
      </div>
    </div>
  );
}

function AlertItem({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: '#fef3c7', borderRadius: '4px', color: '#92400e' }}>
      <AlertCircle size={14} />
      {text}
    </div>
  );
}

// ==================== KPI LIBRARY ====================

function KPILibrary() {
  const [selectedDept, setSelectedDept] = useState('HR');
  const departments = Object.keys(KPI_LIBRARY);

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', color: COLORS.text }}>📚 KPI Library (155+ KPIs)</h2>

      <div style={{ marginBottom: '30px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {departments.map(dept => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            style={{
              padding: '8px 16px',
              background: selectedDept === dept ? COLORS.secondary : COLORS.light,
              color: selectedDept === dept ? 'white' : COLORS.text,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px'
            }}
          >
            {dept}
          </button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: COLORS.light }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '13px' }}>KPI Name</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '13px' }}>Unit</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '13px' }}>Target</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '13px' }}>Weight</th>
            </tr>
          </thead>
          <tbody>
            {KPI_LIBRARY[selectedDept].map(kpi => (
              <tr key={kpi.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: '12px', fontSize: '13px' }}>{kpi.name}</td>
                <td style={{ padding: '12px', fontSize: '13px' }}>{kpi.unit}</td>
                <td style={{ padding: '12px', fontSize: '13px' }}>{kpi.target}</td>
                <td style={{ padding: '12px', fontSize: '13px', fontWeight: '600', color: COLORS.secondary }}>{kpi.weight}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== EMPLOYEE PERFORMANCE SCORECARD ====================

function PerformanceScorecard() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeKPIs, setEmployeeKPIs] = useState([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const { data } = await supabase.from('employees').select('*');
      setEmployees(data || []);
      if (data && data.length > 0) {
        setSelectedEmployee(data[0]);
        loadKPIs(data[0].id);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const loadKPIs = async (empId) => {
    const mockKPIs = [
      { id: 1, name: 'Revenue Growth', target: 100000, actual: 85000, weight: 40 },
      { id: 2, name: 'Customer Satisfaction', target: 90, actual: 88, weight: 30 },
      { id: 3, name: 'Goal Completion', target: 100, actual: 95, weight: 20 },
      { id: 4, name: 'Team Collaboration', target: 100, actual: 92, weight: 10 }
    ];
    setEmployeeKPIs(mockKPIs);
  };

  if (!selectedEmployee) return <div style={{ padding: '30px' }}>Loading...</div>;

  const finalScore = calculatePerformanceScore(selectedEmployee, employeeKPIs);
  const gradeInfo = getGrade(finalScore);

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', color: COLORS.text }}>📋 Performance Scorecard</h2>

      <div style={{ marginBottom: '30px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {employees.map(emp => (
          <button
            key={emp.id}
            onClick={() => {
              setSelectedEmployee(emp);
              loadKPIs(emp.id);
            }}
            style={{
              padding: '10px 16px',
              background: selectedEmployee?.id === emp.id ? COLORS.secondary : COLORS.light,
              color: selectedEmployee?.id === emp.id ? 'white' : COLORS.text,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontWeight: '600'
            }}
          >
            {emp.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Employee Information</h3>
          <div style={{ display: 'grid', gap: '12px', fontSize: '13px' }}>
            <div><strong>Name:</strong> {selectedEmployee.name}</div>
            <div><strong>Department:</strong> {selectedEmployee.role}</div>
            <div><strong>Email:</strong> {selectedEmployee.email}</div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `2px solid ${gradeInfo.color}` }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Performance Grade</h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: '700', color: gradeInfo.color, marginBottom: '8px' }}>{finalScore}</div>
            <div style={{ fontSize: '20px', fontWeight: '600', color: gradeInfo.color }}>{gradeInfo.grade}</div>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>KPI Performance Details</h3>
        {employeeKPIs.map(kpi => {
          const achievement = (kpi.actual / kpi.target) * 100;
          const statusColor = achievement >= 90 ? COLORS.success : achievement >= 70 ? COLORS.warning : COLORS.danger;
          return (
            <div key={kpi.id} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <strong>{kpi.name}</strong>
                <span style={{ color: statusColor, fontWeight: '600' }}>{Math.round(achievement)}%</span>
              </div>
              <div style={{ background: COLORS.light, height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ background: statusColor, height: '100%', width: `${Math.min(achievement, 100)}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '12px', color: '#6b7280' }}>
                <span>Target: {kpi.target}</span>
                <span>Actual: {kpi.actual}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== ADVANCED ANALYTICS ====================

function AdvancedAnalytics() {
  const departments = ['Sales', 'Development', 'HR', 'IT', 'Support'];
  const performanceData = {
    Sales: [88, 85, 92, 86, 89],
    Development: [85, 87, 88, 85, 86],
    HR: [82, 84, 83, 85, 82],
    IT: [79, 81, 80, 82, 79],
    Support: [75, 77, 76, 78, 75]
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '30px', color: COLORS.text }}>📊 Advanced Analytics</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Department Benchmark</h3>
          {departments.map((dept, i) => {
            const avgScore = performanceData[dept].reduce((a, b) => a + b) / performanceData[dept].length;
            return (
              <div key={i} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                  <strong>{dept}</strong>
                  <span style={{ color: COLORS.secondary, fontWeight: '600' }}>{Math.round(avgScore)}%</span>
                </div>
                <div style={{ background: COLORS.light, height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ background: COLORS.secondary, height: '100%', width: `${avgScore}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Performance Insights</h3>
          <div style={{ display: 'grid', gap: '12px', fontSize: '13px' }}>
            <InsightItem icon="📈" text="Sales dept outperforming by 6%" />
            <InsightItem icon="⚠️" text="Support needs improvement focus" />
            <InsightItem icon="🎯" text="Overall company KPI hit: 82%" />
            <InsightItem icon="🚀" text="3 employees on track for bonuses" />
          </div>
        </div>
      </div>

      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Trend Analysis (Last 5 Months)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
          {['Jan', 'Feb', 'Mar', 'Apr', 'May'].map((month, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '12px', background: COLORS.light, borderRadius: '6px' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>{month}</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: COLORS.secondary }}>{72 + i * 3}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InsightItem({ icon, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: COLORS.light, borderRadius: '4px' }}>
      <span style={{ fontSize: '16px' }}>{icon}</span>
      {text}
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

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'kpi-library', name: 'KPI Library', icon: Target },
    { id: 'scorecard', name: 'Scorecard', icon: Award },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ];

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard': return <Dashboard user={currentUser} />;
      case 'kpi-library': return <KPILibrary />;
      case 'scorecard': return <PerformanceScorecard />;
      case 'analytics': return <AdvancedAnalytics />;
      default: return <Dashboard user={currentUser} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.light, fontFamily: "'Segoe UI'" }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? '260px' : '0', background: COLORS.primary, color: 'white', padding: sidebarOpen ? '20px 0' : '0', transition: 'all 0.3s', overflow: 'hidden', borderRight: `1px solid ${COLORS.border}` }}>
        <h1 style={{ margin: sidebarOpen ? '0 20px 30px 20px' : '0', fontSize: '14px', fontWeight: '700' }}>PerfTrack Pro</h1>
        <p style={{ margin: sidebarOpen ? '0 20px 20px 20px' : '0', fontSize: '11px', color: '#9ca3af' }}>KPI Engine v2.0</p>

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
