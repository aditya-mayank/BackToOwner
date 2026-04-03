import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { adminAPI } from '../api/endpoints.js'

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
      onClick={(e) => { e.stopPropagation(); onChange(); }}
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
  const [users, setUsers] = useState([])
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    activeItems: 0,
    resolvedItems: 0,
    activeUsers: 0,
    activeChats: 0
  })
  const [selectedItem, setSelectedItem] = useState(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)

  // Fetch all data
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    // Separate fetchers for better error isolation
    const fetchStats = async () => {
      try {
        const data = await adminAPI.getStats()
        if (data.success) setStats(data.stats)
      } catch (err) {
        console.error('Stats Fetch Error:', err)
      }
    }

    const fetchUsers = async () => {
      try {
        const data = await adminAPI.getAllUsers()
        if (data.success) setUsers(data.users || [])
      } catch (err) {
        console.error('Users Fetch Error:', err)
        setError('Users list could not be loaded. Please ensure you have admin privileges.')
      }
    }

    const fetchItems = async () => {
      try {
        const data = await adminAPI.getAllItems()
        if (data.success) setItems(data.items || [])
      } catch (err) {
        console.error('Items Fetch Error:', err)
      }
    }

    // Run them in parallel but handle independently
    await Promise.allSettled([fetchStats(), fetchUsers(), fetchItems()])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    // Auto-refresh every 30 seconds so new users/items appear without manual refresh
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'blocked' : 'active'
      if (newStatus === 'blocked' && !window.confirm('Are you sure you want to block this user? They will be unable to log in and all active chats will be closed.')) {
        return;
      }
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, accountStatus: newStatus } : u))
      
      await adminAPI.blockUser(userId, newStatus)
      fetchData()
    } catch (err) {
      console.error('Failed to toggle user status:', err)
      setError('Failed to update user status.')
      fetchData() 
    }
  }

  const statsDisplay = [
    { label: 'Active Reports', value: stats.activeItems || 0 },
    { label: 'Total Resolved', value: stats.resolvedItems || 0, color: '#10B981' },
    { label: 'Active Users', value: stats.activeUsers || 0, color: '#F59E0B' },
    { label: 'Open Chats', value: stats.activeChats || 0, color: '#F43F5E' },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'var(--color-bg)', display:'flex', flexDirection:'column' }}>
      {/* Navbar */}
      <header className="admin-header" style={{ height:'auto', minHeight:'64px', background:'var(--color-card)', borderBottom:'1px solid var(--color-card-border)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 20px', flexWrap:'wrap', gap:'12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ padding:'6px 10px', background:'rgba(244,63,94,0.1)', color:'#F43F5E', borderRadius:'8px', fontSize:'12px', fontWeight:800, textTransform:'uppercase', border:'1px solid rgba(244,63,94,0.3)' }}>Admin Portal</div>
          <h1 style={{ fontSize:'20px', fontWeight:800, color:'var(--color-text-primary)' }}>BackToOwner</h1>
        </div>
        <div style={{ display:'flex', gap:'12px', alignItems:'center' }}>
          {/* Theme Toggle */}
          <button 
            id="admin-theme-toggle"
            onClick={() => {
              const root = document.documentElement;
              const isDark = root.classList.contains('dark');
              const newMode = isDark ? 'light' : 'dark';
              root.classList.toggle('dark',  newMode === 'dark');
              root.classList.toggle('light', newMode === 'light');
              localStorage.setItem('backtoowner-theme', newMode);
            }} 
            style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px', width:'40px', height:'40px', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', cursor:'pointer' }}
          >
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 12px', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'10px' }}>
            <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#10B981', animation:'live-pulse 2s infinite' }}/>
            <span style={{ fontSize:'12px', fontWeight:700, color:'#10B981' }}>Live</span>
          </div>
          <button onClick={fetchData} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px', padding:'8px 16px', color:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:600 }}>Refresh</button>
          <button onClick={() => navigate('/dashboard')} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px', padding:'8px 16px', color:'var(--color-text-secondary)', cursor:'pointer' }} onMouseEnter={e=>e.currentTarget.style.color='#fff'} onMouseLeave={e=>e.currentTarget.style.color='var(--color-text-secondary)'}>
            Exit Admin
          </button>
        </div>
      </header>

      <main className="admin-main" style={{ flex:1, padding:'24px', maxWidth:'1200px', margin:'0 auto', width:'100%' }}>
        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              style={{ padding:'12px 20px', background:'rgba(244,63,94,0.15)', border:'1px solid rgba(244,63,94,0.3)', borderRadius:'12px', color:'#F43F5E', fontSize:'14px', fontWeight:600, marginBottom:'24px', display:'flex', justifyContent:'space-between', alignItems:'center' }}
            >
              <span>⚠️ Error: {error}</span>
              <button onClick={() => setError(null)} style={{ background:'none', border:'none', color:'#F43F5E', cursor:'pointer', fontSize:'18px' }}>×</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'20px', marginBottom:'40px' }}>
          {statsDisplay.map(stat => (
            <div key={stat.label} style={{ background:'var(--color-card)', padding:'24px', borderRadius:'16px', border:'1px solid var(--color-card-border)', boxShadow:'0 4px 24px rgba(0,0,0,0.2)' }}>
              <p style={{ fontSize:'13px', fontWeight:600, color:'var(--color-text-muted)', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.05em' }}>{stat.label}</p>
              <p style={{ fontSize:'36px', fontWeight:800, color: stat.color || 'var(--color-text-primary)' }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'12px', marginBottom:'24px' }}>
          {['Reports', 'Users'].map(tab => (
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
          <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <h2 style={{ fontSize:'18px', fontWeight:700, color:'var(--color-text-primary)' }}>{activeTab} Management</h2>
          </div>

          <div style={{ overflowX:'auto' }}>
            {activeTab === 'Reports' && (
              <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left' }}>
                <thead>
                  <tr style={{ background:'rgba(255,255,255,0.02)', borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding:'16px 24px', fontSize:'12px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase' }}>Student</th>
                    <th style={{ padding:'16px 24px', fontSize:'12px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase' }}>Item</th>
                    <th style={{ padding:'16px 24px', fontSize:'12px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase' }}>Type</th>
                    <th style={{ padding:'16px 24px', fontSize:'12px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase' }}>Status</th>
                    <th style={{ padding:'16px 24px', fontSize:'12px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase', textAlign:'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <>{[1,2,3,4,5].map(i => <tr key={i}><td colSpan="5"><SkeletonRow /></td></tr>)}</>
                  ) : items.length > 0 ? (
                    items.map((item, i) => (
                      <tr key={item._id} style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding:'16px 24px', fontSize:'14px', color:'var(--color-text-primary)', fontWeight:600 }}>{item.reportedBy?.name || 'Unknown'}</td>
                        <td style={{ padding:'16px 24px', fontSize:'14px', color:'var(--color-text-secondary)' }}>{item.title}</td>
                        <td style={{ padding:'16px 24px', fontSize:'14px', textTransform:'capitalize' }}>{item.type}</td>
                        <td style={{ padding:'16px 24px', fontSize:'14px' }}>
                          <span style={{ padding:'4px 8px', borderRadius:'6px', background: item.status === 'resolved' ? 'rgba(16,185,129,0.1)' : 'rgba(79,70,229,0.1)', color: item.status === 'resolved' ? '#10B981' : '#818CF8', fontWeight:600, fontSize:'12px' }}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ padding:'16px 24px', textAlign:'right' }}>
                          <button onClick={() => { setSelectedItem(item); setViewModalOpen(true); }} style={{ background:'transparent', border:'none', color:'#4F46E5', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>View Details</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ padding:'60px 24px', textAlign:'center', color:'var(--color-text-muted)', fontSize:'15px' }}>
                        No reports found yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'Users' && (
              <table style={{ width:'100%', borderCollapse:'collapse', textAlign:'left' }}>
                <thead>
                  <tr style={{ background:'rgba(255,255,255,0.02)', borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding:'16px 24px', fontSize:'12px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase' }}>User Info</th>
                    <th style={{ padding:'16px 24px', fontSize:'12px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase' }}>Role</th>
                    <th style={{ padding:'16px 24px', fontSize:'12px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase' }}>Last Login</th>
                    <th style={{ padding:'16px 24px', fontSize:'12px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase' }}>Status</th>
                    <th style={{ padding:'16px 24px', fontSize:'12px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase', textAlign:'right' }}>Access Control</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <>{[1,2,3].map(i => <tr key={i}><td colSpan="4"><SkeletonRow /></td></tr>)}</>
                  ) : users.length > 0 ? (
                    users.map((u) => (
                      <tr key={u._id} style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding:'16px 24px' }}>
                          <p style={{ fontSize:'15px', fontWeight:700, color:'var(--color-text-primary)' }}>{u.name}</p>
                          <div style={{ display:'flex', flexDirection:'column', gap:'1px' }}>
                            <p style={{ fontSize:'12px', color:'var(--color-text-muted)' }}>{u.email}</p>
                            {u.roll && <p style={{ fontSize:'11px', fontWeight:700, color:'#818CF8' }}>{u.roll}</p>}
                          </div>
                        </td>
                        <td style={{ padding:'16px 24px', fontSize:'14px', color:'var(--color-text-secondary)', textTransform:'capitalize' }}>{u.role}</td>
                        <td style={{ padding:'16px 24px' }}>
                          {u.lastLoginAt ? (
                            <div>
                              <p style={{ fontSize:'13px', color:'var(--color-text-primary)', fontWeight:600 }}>
                                {new Date(u.lastLoginAt).toLocaleDateString()}
                              </p>
                              <p style={{ fontSize:'11px', color:'var(--color-text-muted)' }}>
                                {new Date(u.lastLoginAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                              </p>
                            </div>
                          ) : (
                            <span style={{ fontSize:'12px', color:'var(--color-text-muted)', fontStyle:'italic' }}>Never</span>
                          )}
                        </td>
                        <td style={{ padding:'16px 24px' }}>
                          <span style={{ padding:'4px 8px', borderRadius:'6px', background: u.accountStatus === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)', color: u.accountStatus === 'active' ? '#10B981' : '#F43F5E', fontWeight:600, fontSize:'12px', textTransform:'capitalize' }}>
                            {u.accountStatus}
                          </span>
                        </td>
                        <td style={{ padding:'16px 24px', textAlign:'right' }}>
                          {u.role !== 'admin' && (
                            <div style={{ display:'flex', justifyContent:'flex-end', alignItems:'center', gap:'12px' }}>
                              <span style={{ fontSize:'13px', color:'var(--color-text-muted)' }}>{u.accountStatus === 'active' ? 'Active' : 'Blocked'}</span>
                              <ToggleSwitch active={u.accountStatus === 'active'} onChange={() => toggleUserStatus(u._id, u.accountStatus)} />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ padding:'60px 24px', textAlign:'center', color:'var(--color-text-muted)', fontSize:'15px' }}>
                        No students registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* ─── View Details Modal ─────────────────────────────── */}
      <AnimatePresence>
        {viewModalOpen && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setViewModalOpen(false)}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}
          >
            <motion.div
              initial={{ scale:0.92, y:20, opacity:0 }} animate={{ scale:1, y:0, opacity:1 }} exit={{ scale:0.92, opacity:0 }}
              onClick={e => e.stopPropagation()}
              style={{ background:'var(--color-card)', border:'1px solid var(--color-card-border)', borderRadius:'24px', padding:'32px', maxWidth:'560px', width:'100%', boxShadow:'0 24px 64px rgba(0,0,0,0.5)', maxHeight:'90vh', overflowY:'auto' }}
            >
              {/* Header */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px' }}>
                <div>
                  <h2 style={{ fontSize:'22px', fontWeight:800, color:'var(--color-text-primary)', marginBottom:'8px' }}>{selectedItem.title}</h2>
                  <span style={{ fontSize:'11px', fontWeight:700, padding:'3px 10px', borderRadius:'20px',
                    background: selectedItem.status === 'resolved' ? 'rgba(16,185,129,0.15)' : 'rgba(79,70,229,0.15)',
                    color: selectedItem.status === 'resolved' ? '#10B981' : '#818CF8',
                    textTransform:'uppercase', letterSpacing:'0.05em'
                  }}>{selectedItem.status}</span>
                </div>
                <button onClick={() => setViewModalOpen(false)} style={{ background:'rgba(255,255,255,0.06)', border:'none', borderRadius:'10px', width:'36px', height:'36px', cursor:'pointer', color:'var(--color-text-muted)', fontSize:'20px', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
              </div>

              {/* Image */}
              {selectedItem.imageUrl && (
                <img src={selectedItem.imageUrl} alt={selectedItem.title}
                  style={{ width:'100%', height:'200px', objectFit:'cover', borderRadius:'16px', marginBottom:'20px', border:'1px solid var(--color-card-border)' }}
                />
              )}

              {/* Info Grid */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'20px' }}>
                {[
                  { label:'Reporter', value: selectedItem.reportedBy?.name || 'Unknown' },
                  { label:'Type',     value: selectedItem.type },
                  { label:'Category', value: selectedItem.category },
                  { label:'Location', value: selectedItem.location },
                  { label:'Visibility', value: selectedItem.visibility || '—' },
                  { label:'Date Filed', value: new Date(selectedItem.createdAt).toLocaleDateString() },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ fontSize:'10px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'3px' }}>{label}</p>
                    <p style={{ fontSize:'14px', fontWeight:600, color:'var(--color-text-primary)', textTransform:'capitalize' }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              {selectedItem.description && (
                <div style={{ padding:'16px', background:'rgba(255,255,255,0.03)', borderRadius:'12px', border:'1px solid var(--color-card-border)' }}>
                  <p style={{ fontSize:'10px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'8px' }}>Description</p>
                  <p style={{ fontSize:'14px', color:'var(--color-text-secondary)', lineHeight:1.7 }}>{selectedItem.description}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.5); }
        }
      `}</style>
    </div>
  )
}
