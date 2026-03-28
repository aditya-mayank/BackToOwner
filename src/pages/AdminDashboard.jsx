import React, { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
/* ─── Mock Data ──────────────────────────────────────────────────────── */
const STATS = [
  { label: 'Total Active Reports', value: '142' },
  { label: 'Matches Today', value: '18', color: '#10B981' },
  { label: 'Flagged Reports', value: '3', color: '#F59E0B' },
  { label: 'Users Blocked', value: '5', color: '#F43F5E' },
]
const MOCK_REPORTS = Array.from({ length: 12 }).map((_, i) => ({
  id: `rep-${i}`,
  student: i % 2 === 0 ? 'Arjun Reddy' : 'Sneha Sharma',
  item: i % 3 === 0 ? 'BoAt AirPods' : 'MacBook Charger',
  status: i % 4 === 0 ? 'Matched' : 'Active',
  score: i % 4 === 0 ? (70 + (i * 2)) : '-',
  date: `2${i} Mar 2026`,
}))
const MOCK_USERS = [
  { id: 'u1', name: 'Arjun Reddy', roll: '22CSB0001', email: 'arjun@nitw.ac.in', status: 'active' },
  { id: 'u2', name: 'Sneha Sharma', roll: '22EE0042', email: 'sneha@nitw.ac.in', status: 'blocked' },
  { id: 'u3', name: 'Ravi Teja', roll: '21ME0104', email: 'ravi@nitw.ac.in', status: 'active' },
]
/* ─── Skeletons ──────────────────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:'16px', padding:'16px 24px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
      {[1,2,3,4,5,6].map(i => (
        <div key={i} style={{ height:'16px', background:'rgba(255,255,255,0.05)', borderRadius:'4px', width: i % 2 === 0 ? '60%' : '80%' }} />
      ))}
    </div>
  )
}
/* ─── Toggle Switch ──────────────────────────────────────────────────── */
function ToggleSwitch({ active, onChange }) {
  return (
    <div
      onClick={onChange}
      style={{
        width:'40px', height:'24px', borderRadius:'12px', background: active ? '#10B981' : 'rgba(255,255,255,0.1)',
        display:'flex', alignItems:'center', padding:'2px', cursor:'pointer', transition:'background 0.3s'
      }}
    >
      <motion.div
        layout
        transition={{ type:'spring', stiffness:500, damping:30 }}
        style={{ width:'20px', height:'20px', borderRadius:'50%', background:'#fff', x: active ? 16 : 0, boxShadow:'0 2px 4px rgba(0,0,0,0.2)' }}
      />
    </div>
  )
}
/* ─── Main Component ─────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Reports')
  const [users, setUsers] = useState(MOCK_USERS)
  useEffect(() => {
    // Simulate initial data fetch
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])
  const toggleUserStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) return { ...u, status: u.status === 'active' ? 'blocked' : 'active' }
      return u
    }))
  }
  return (
    <div style={{ minHeight:'100vh', background:'var(--color-bg)', display:'flex', flexDirection:'column' }}>
      {/* Navbar */}
      <header style={{ height:'72px', background:'var(--color-card)', borderBottom:'1px solid var(--color-card-border)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ padding:'6px 10px', background:'rgba(244,63,94,0.1)', color:'#F43F5E', borderRadius:'8px', fontSize:'12px', fontWeight:800, textTransform:'uppercase', border:'1px solid rgba(244,63,94,0.3)' }}>Admin Portal</div>
          <h1 style={{ fontSize:'20px', fontWeight:800, color:'var(--color-text-primary)' }}>BackToOwner</h1>
        </div>
        <button onClick={() => navigate('/dashboard')} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px', padding:'8px 16px', color:'var(--color-text-secondary)', cursor:'pointer' }} onMouseEnter={e=>e.currentTarget.style.color='#fff'} onMouseLeave={e=>e.currentTarget.style.color='var(--color-text-secondary)'}>
          Exit Admin
        </button>
      </header>
      <main style={{ flex:1, padding:'32px', maxWidth:'1200px', margin:'0 auto', width:'100%' }}>
        {/* Stats Row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'20px', marginBottom:'40px' }}>
          {STATS.map(stat => (
            <div key={stat.label} style={{ background:'var(--color-card)', padding:'24px', borderRadius:'16px', border:'1px solid var(--color-card-border)', boxShadow:'0 4px 24px rgba(0,0,0,0.2)' }}>
              <p style={{ fontSize:'13px', fontWeight:600, color:'var(--color-text-muted)', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.05em' }}>{stat.label}</p>
              <p style={{ fontSize:'36px', fontWeight:800, color: stat.color || 'var(--color-text-primary)' }}>{stat.value}</p>
            </div>
          ))}
        </div>
        {/* Tabs */}
        <div style={{ display:'flex', gap:'12px', marginBottom:'24px' }}>
          {['Reports', 'Flagged', 'Users'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ padding:'10px 24px', borderRadius:'12px', border:'none', fontSize:'15px', fontWeight:600, cursor:'pointer', transition:'all 0.2s', background: activeTab === tab ? '#4F46E5' : 'rgba(255,255,255,0.05)', color: activeTab === tab ? '#fff' : 'var(--color-text-secondary)' }}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Tab Content Area */}
        <div style={{ background:'var(--color-card)', borderRadius:'20px', border:'1px solid var(--color-card-border)', overflow:'hidden', boxShadow:'0 12px 40px rgba(0,0,0,0.3)' }}>
          {/* Header & Search */}
          <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <h2 style={{ fontSize:'18px', fontWeight:700, color:'var(--color-text-primary)' }}>{activeTab} Management</h2>
            <div style={{ position:'relative' }}>
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16" style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'var(--color-text-muted)' }}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              <input type="text" placeholder={`Search ${activeTab.toLowerCase()}...`} style={{ padding:'8px 12px 8px 36px', borderRadius:'10px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', color:'var(--color-text-primary)', outline:'none', fontSize:'14px' }} />
            </div>
          </div>
          {/* Table Container */}
          <div style={{ overflowX:'auto' }}>
            {activeTab === 'Reports' && (
              <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left' }}>
                <thead>
                  <tr style={{ background:'rgba(255,255,255,0.02)', borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding:'16px 24px', fontSize:'12px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.05em' }}>Student</th>
                    <th style={{ padding:'16px 24px', fontSize:'12px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.05em' }}>Item</th>
                    <th style={{ padding:'16px 24px', fontSize:'12px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.05em' }}>Status</th>
                    <th style={{ padding:'16px 24px', fontSize:'12px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.05em' }}>Score</th>
                    <th style={{ padding:'16px 24px', fontSize:'12px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.05em' }}>Date</th>
                    <th style={{ padding:'16px 24px', fontSize:'12px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.05em', textAlign:'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <>{[1,2,3,4,5].map(i => <tr key={i}><td colSpan="6"><SkeletonRow /></td></tr>)}</>
                  ) : (
                    MOCK_REPORTS.slice(0,5).map((r, i) => (
                      <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', background: i%2===0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                        <td style={{ padding:'16px 24px', fontSize:'14px', color:'var(--color-text-primary)', fontWeight:600 }}>{r.student}</td>
                        <td style={{ padding:'16px 24px', fontSize:'14px', color:'var(--color-text-secondary)' }}>{r.item}</td>
                        <td style={{ padding:'16px 24px', fontSize:'14px' }}>
                          <span style={{ padding:'4px 8px', borderRadius:'6px', background: r.status === 'Matched' ? 'rgba(16,185,129,0.1)' : 'rgba(79,70,229,0.1)', color: r.status === 'Matched' ? '#10B981' : '#818CF8', fontWeight:600, fontSize:'12px' }}>
                            {r.status}
                          </span>
                        </td>
                        <td style={{ padding:'16px 24px', fontSize:'14px', color: r.score !== '-' ? '#10B981' : 'var(--color-text-muted)', fontWeight:700 }}>{r.score}{r.score !== '-' && '%'}</td>
                        <td style={{ padding:'16px 24px', fontSize:'14px', color:'var(--color-text-muted)' }}>{r.date}</td>
                        <td style={{ padding:'16px 24px', textAlign:'right' }}>
                          <button style={{ background:'transparent', border:'none', color:'#4F46E5', fontSize:'13px', fontWeight:600, cursor:'pointer', marginRight:'12px' }}>View</button>
                          <button style={{ background:'transparent', border:'none', color:'#F43F5E', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>Flag</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
            {activeTab === 'Flagged' && (
              <div style={{ padding:'24px', display:'flex', flexDirection:'column', gap:'16px' }}>
                {loading ? <SkeletonRow /> : (
                  <div style={{ borderLeft:'4px solid #F43F5E', background:'rgba(244,63,94,0.05)', padding:'20px', borderRadius:'12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <h3 style={{ fontSize:'16px', fontWeight:700, color:'#FB7185', marginBottom:'4px' }}>Inappropriate Description</h3>
                      <p style={{ fontSize:'13px', color:'var(--color-text-secondary)' }}>Reported by multiple users on item "Wallet" by Ravi Teja.</p>
                    </div>
                    <div style={{ display:'flex', gap:'8px' }}>
                      <button style={{ padding:'8px 16px', borderRadius:'8px', background:'rgba(16,185,129,0.1)', color:'#10B981', border:'none', fontWeight:600, cursor:'pointer' }}>Approve</button>
                      <button style={{ padding:'8px 16px', borderRadius:'8px', background:'rgba(244,63,94,0.1)', color:'#F43F5E', border:'none', fontWeight:600, cursor:'pointer' }}>Delete & Block User</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'Users' && (
              <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left' }}>
                <thead>
                  <tr style={{ background:'rgba(255,255,255,0.02)', borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding:'16px 24px', fontSize:'12px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase' }}>User Info</th>
                    <th style={{ padding:'16px 24px', fontSize:'12px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase' }}>Roll No</th>
                    <th style={{ padding:'16px 24px', fontSize:'12px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase' }}>Status</th>
                    <th style={{ padding:'16px 24px', fontSize:'12px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase', textAlign:'right' }}>Account Access</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <>{[1,2,3].map(i => <tr key={i}><td colSpan="4"><SkeletonRow /></td></tr>)}</>
                  ) : (
                    users.map((u, i) => (
                      <tr key={u.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding:'16px 24px' }}>
                          <p style={{ fontSize:'15px', fontWeight:700, color:'var(--color-text-primary)' }}>{u.name}</p>
                          <p style={{ fontSize:'13px', color:'var(--color-text-muted)' }}>{u.email}</p>
                        </td>
                        <td style={{ padding:'16px 24px', fontSize:'14px', color:'var(--color-text-secondary)' }}>{u.roll}</td>
                        <td style={{ padding:'16px 24px' }}>
                          <span style={{ padding:'4px 8px', borderRadius:'6px', background: u.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)', color: u.status === 'active' ? '#10B981' : '#F43F5E', fontWeight:600, fontSize:'12px', textTransform:'capitalize' }}>
                            {u.status}
                          </span>
                        </td>
                        <td style={{ padding:'16px 24px', textAlign:'right' }}>
                          <div style={{ display:'flex', justifyContent:'flex-end', alignItems:'center', gap:'12px' }}>
                            <span style={{ fontSize:'13px', color:'var(--color-text-muted)' }}>{u.status === 'active' ? 'Active' : 'Blocked'}</span>
                            <ToggleSwitch active={u.status === 'active'} onChange={() => toggleUserStatus(u.id)} />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
          {/* Pagination Mock */}
          <div style={{ padding:'16px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid rgba(255,255,255,0.05)', background:'rgba(255,255,255,0.01)' }}>
            <span style={{ fontSize:'13px', color:'var(--color-text-muted)' }}>Showing 1-5 of 12 entries</span>
            <div style={{ display:'flex', gap:'8px' }}>
              <button style={{ padding:'6px 12px', borderRadius:'8px', background:'rgba(255,255,255,0.05)', border:'none', color:'var(--color-text-secondary)', cursor:'pointer' }}>Prev</button>
              <button style={{ padding:'6px 12px', borderRadius:'8px', background:'rgba(255,255,255,0.1)', border:'none', color:'#fff', cursor:'pointer' }}>1</button>
              <button style={{ padding:'6px 12px', borderRadius:'8px', background:'rgba(255,255,255,0.05)', border:'none', color:'var(--color-text-secondary)', cursor:'pointer' }}>Next</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
