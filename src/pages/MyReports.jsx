import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '../components/DashboardLayout'
/* ─── Mock Data ──────────────────────────────────────────────────────── */
const INITIAL_REPORTS = [
  {
    id: 'r1', type: 'lost', status: 'active',
    itemName: 'Black OnePlus 11 Phone', category: '📱 Electronics',
    location: 'Main Gate', date: '28 Mar 2026', matchScore: null
  },
  {
    id: 'r2', type: 'lost', status: 'matched',
    itemName: 'Grey Nike Backpack', category: '🎒 Bags',
    location: 'Library', date: '28 Mar 2026', matchScore: 85
  },
  {
    id: 'r3', type: 'found', status: 'active',
    itemName: 'Red Water Bottle', category: '📦 Others',
    location: 'Sports Complex', date: '27 Mar 2026', matchScore: null
  },
  {
    id: 'r4', type: 'lost', status: 'resolved',
    itemName: 'College ID Card', category: '🪪 ID / Cards',
    location: 'Canteen', date: '20 Mar 2026', matchScore: 100
  },
]
/* ─── Delete Modal ───────────────────────────────────────────────────── */
function DeleteModal({ isOpen, onClose, onConfirm, itemName }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={onClose}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', zIndex:999 }}
          />
          <motion.div
            initial={{ opacity:0, scale:0.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95, y:20 }}
            style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'var(--color-card)', border:'1px solid var(--color-card-border)', borderRadius:'20px', padding:'32px', width:'90%', maxWidth:'400px', zIndex:1000, boxShadow:'0 24px 48px rgba(0,0,0,0.4)', textAlign:'center' }}
          >
            <div style={{ width:'56px', height:'56px', borderRadius:'16px', background:'rgba(244,63,94,0.1)', color:'#F43F5E', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', border:'1px solid rgba(244,63,94,0.2)' }}>
              <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 style={{ fontSize:'20px', fontWeight:700, color:'var(--color-text-primary)', marginBottom:'8px' }}>Delete Report?</h3>
            <p style={{ fontSize:'14px', color:'var(--color-text-secondary)', lineHeight:1.5, marginBottom:'24px' }}>
              Are you sure you want to delete <strong style={{color:'#fff'}}>{itemName}</strong>? This action cannot be undone.
            </p>
            <div style={{ display:'flex', gap:'12px' }}>
              <button onClick={onClose} style={{ flex:1, padding:'12px', background:'rgba(255,255,255,0.05)', border:'none', borderRadius:'12px', color:'var(--color-text-primary)', fontSize:'14px', fontWeight:600, cursor:'pointer' }}>Cancel</button>
              <button onClick={onConfirm} style={{ flex:1, padding:'12px', background:'#F43F5E', border:'none', borderRadius:'12px', color:'#fff', fontSize:'14px', fontWeight:600, cursor:'pointer' }}>Delete</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
/* ─── View Modal ─────────────────────────────────────────────────────── */
function ViewModal({ isOpen, onClose, report }) {
  if (!report) return null
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={onClose}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', zIndex:999 }}
          />
          <motion.div
            initial={{ opacity:0, scale:0.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95, y:20 }}
            style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'var(--color-card)', border:'1px solid var(--color-card-border)', borderRadius:'20px', padding:'32px', width:'90%', maxWidth:'500px', zIndex:1000, boxShadow:'0 24px 48px rgba(0,0,0,0.4)' }}
          >
            <h3 style={{ fontSize:'22px', fontWeight:800, color:'var(--color-text-primary)', marginBottom:'20px' }}>Report Details</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'16px', marginBottom:'32px' }}>
              <div style={{ background:'rgba(255,255,255,0.03)', padding:'16px', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize:'12px', color:'var(--color-text-muted)', textTransform:'uppercase', fontWeight:700, marginBottom:'4px' }}>Item Name</p>
                <p style={{ fontSize:'16px', color:'var(--color-text-primary)', fontWeight:600 }}>{report.itemName}</p>
              </div>
              <div style={{ display:'flex', gap:'16px' }}>
                <div style={{ flex:1, background:'rgba(255,255,255,0.03)', padding:'16px', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize:'12px', color:'var(--color-text-muted)', textTransform:'uppercase', fontWeight:700, marginBottom:'4px' }}>Category</p>
                  <p style={{ fontSize:'14px', color:'var(--color-text-primary)' }}>{report.category}</p>
                </div>
                <div style={{ flex:1, background:'rgba(255,255,255,0.03)', padding:'16px', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize:'12px', color:'var(--color-text-muted)', textTransform:'uppercase', fontWeight:700, marginBottom:'4px' }}>Date</p>
                  <p style={{ fontSize:'14px', color:'var(--color-text-primary)' }}>{report.date}</p>
                </div>
              </div>
              <div style={{ background:'rgba(255,255,255,0.03)', padding:'16px', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize:'12px', color:'var(--color-text-muted)', textTransform:'uppercase', fontWeight:700, marginBottom:'4px' }}>Location</p>
                <p style={{ fontSize:'14px', color:'var(--color-text-primary)' }}>{report.location}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ width:'100%', padding:'14px', background:'#4F46E5', border:'none', borderRadius:'12px', color:'#fff', fontSize:'15px', fontWeight:600, cursor:'pointer' }}>Close</button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
/* ─── Edit Modal ─────────────────────────────────────────────────────── */
function EditModal({ isOpen, onClose, report, onSave }) {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  // Update local state when report changes
  React.useEffect(() => {
    if (report) {
      setName(report.itemName)
      setLocation(report.location)
    }
  }, [report])
  if (!report) return null
  const handleSave = () => {
    onSave({ ...report, itemName: name, location: location })
  }
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={onClose}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', zIndex:999 }}
          />
          <motion.div
            initial={{ opacity:0, scale:0.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95, y:20 }}
            style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'var(--color-card)', border:'1px solid var(--color-card-border)', borderRadius:'20px', padding:'32px', width:'90%', maxWidth:'400px', zIndex:1000, boxShadow:'0 24px 48px rgba(0,0,0,0.4)' }}
          >
            <h3 style={{ fontSize:'20px', fontWeight:800, color:'var(--color-text-primary)', marginBottom:'20px' }}>Edit Report</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'16px', marginBottom:'24px' }}>
              <div>
                <label style={{ display:'block', fontSize:'13px', color:'var(--color-text-secondary)', marginBottom:'8px', fontWeight:600 }}>Item Name</label>
                <input value={name} onChange={e => setName(e.target.value)} style={{ width:'100%', padding:'12px', borderRadius:'10px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', color:'var(--color-text-primary)', outline:'none', fontSize:'14px' }} />
              </div>
              <div>
                <label style={{ display:'block', fontSize:'13px', color:'var(--color-text-secondary)', marginBottom:'8px', fontWeight:600 }}>Location</label>
                <input value={location} onChange={e => setLocation(e.target.value)} style={{ width:'100%', padding:'12px', borderRadius:'10px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', color:'var(--color-text-primary)', outline:'none', fontSize:'14px' }} />
              </div>
            </div>
            <div style={{ display:'flex', gap:'12px' }}>
              <button onClick={onClose} style={{ flex:1, padding:'12px', background:'rgba(255,255,255,0.05)', border:'none', borderRadius:'12px', color:'var(--color-text-primary)', fontSize:'14px', fontWeight:600, cursor:'pointer' }}>Cancel</button>
              <button onClick={handleSave} style={{ flex:1, padding:'12px', background:'#10B981', border:'none', borderRadius:'12px', color:'#fff', fontSize:'14px', fontWeight:600, cursor:'pointer' }}>Save Changes</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
/* ─── Main Component ─────────────────────────────────────────────────── */
export default function MyReports() {
  const [activeTab, setActiveTab] = useState('Lost Reports')
  const [reports, setReports] = useState(INITIAL_REPORTS)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, reportId: null, itemName: '' })
  const [viewModal, setViewModal] = useState({ isOpen: false, report: null })
  const [editModal, setEditModal] = useState({ isOpen: false, report: null })
  const TABS = ['Lost Reports', 'Found Reports', 'Resolved']
  const filtered = reports.filter(r => {
    if (activeTab === 'Lost Reports') return r.type === 'lost' && r.status !== 'resolved'
    if (activeTab === 'Found Reports') return r.type === 'found' && r.status !== 'resolved'
    if (activeTab === 'Resolved') return r.status === 'resolved'
    return true
  })
  // Status mappings
  const STATUS_MAP = {
    active: { color: '#4F46E5', bg: 'rgba(79,70,229,0.1)', shadow: 'rgba(79,70,229,0.4)', label: 'Active' },
    matched: { color: '#10B981', bg: 'rgba(16,185,129,0.1)', shadow: 'rgba(16,185,129,0.4)', label: 'Match Found', glow: true },
    resolved: { color: '#9CA3AF', bg: 'rgba(156,163,175,0.1)', shadow: 'transparent', label: 'Resolved' },
    archived: { color: '#6B7280', bg: 'rgba(107,114,128,0.1)', shadow: 'transparent', label: 'Archived' }
  }
  const confirmDelete = () => {
    setReports(reports.filter(r => r.id !== deleteModal.reportId))
    setDeleteModal({ isOpen: false, reportId: null, itemName: '' })
  }
  const handleSaveEdit = (updatedReport) => {
    setReports(reports.map(r => r.id === updatedReport.id ? updatedReport : r))
    setEditModal({ isOpen: false, report: null })
  }
  return (
    <DashboardLayout>
      <div style={{ maxWidth:'900px', margin:'0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom:'32px' }}>
          <h1 style={{ fontSize:'clamp(24px,3vw,32px)', fontWeight:800, letterSpacing:'-0.03em', color:'var(--color-text-primary)', marginBottom:'6px' }}>
            My Reports
          </h1>
          <p style={{ fontSize:'14px', color:'var(--color-text-secondary)' }}>Manage your actively tracked lost and found items.</p>
        </div>
        {/* Tabs */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'32px', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:'16px' }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                padding:'10px 24px', borderRadius:'20px', border:'none', cursor:'pointer',
                fontSize:'14px', fontWeight:600, transition:'all .2s',
                background: activeTab === t ? 'rgba(79,70,229,0.15)' : 'transparent',
                color: activeTab === t ? '#818CF8' : 'var(--color-text-muted)'
              }}
            >
              {t}
            </button>
          ))}
        </div>
        {/* Delete Modal */}
        <DeleteModal
          isOpen={deleteModal.isOpen}
          itemName={deleteModal.itemName}
          onClose={() => setDeleteModal({ isOpen: false, reportId: null, itemName: '' })}
          onConfirm={confirmDelete}
        />
        {/* View Details Modal */}
        <ViewModal 
          isOpen={viewModal.isOpen} 
          report={viewModal.report} 
          onClose={() => setViewModal({ isOpen: false, report: null })} 
        />
        {/* Edit Modal */}
        <EditModal 
          isOpen={editModal.isOpen} 
          report={editModal.report} 
          onClose={() => setEditModal({ isOpen: false, report: null })} 
          onSave={handleSaveEdit}
        />
        {/* Report List */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          <AnimatePresence>
            {filtered.length > 0 ? (
              filtered.map((report) => {
                const s = STATUS_MAP[report.status]
                const isMatched = report.status === 'matched'
                return (
                  <motion.div
                    layout
                    key={report.id}
                    initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:0.95 }}
                    whileHover={{ y:-2, border:`1px solid ${s.color}`, boxShadow:`0 8px 30px ${s.bg}` }}
                    style={{
                      padding:'24px', borderRadius:'16px', background:'var(--color-card)',
                      border:'1px solid var(--color-card-border)', transition:'border 0.2s, box-shadow 0.2s',
                      display:'flex', flexDirection:'column', gap:'16px',
                      ...(s.glow && { boxShadow:`0 0 20px ${s.bg}`, border:`1px solid rgba(16,185,129,0.3)` })
                    }}
                  >
                    {/* Top Row: Info + Badges */}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                        <h2 style={{ fontSize:'20px', fontWeight:700, color:'var(--color-text-primary)' }}>{report.itemName}</h2>
                        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                          <span style={{ fontSize:'13px', padding:'4px 10px', borderRadius:'8px', background:'rgba(255,255,255,0.05)', color:'var(--color-text-secondary)', fontWeight:600 }}>
                            {report.category}
                          </span>
                          <div style={{ display:'flex', alignItems:'center', gap:'4px', color:'var(--color-text-muted)', fontSize:'13px' }}>
                            <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="11" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                            {report.location}
                          </div>
                          <div style={{ display:'flex', alignItems:'center', gap:'4px', color:'var(--color-text-muted)', fontSize:'13px' }}>
                            <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                            {report.date}
                          </div>
                        </div>
                      </div>
                      {/* Right side badges */}
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'8px' }}>
                        <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'6px 14px', borderRadius:'10px', background:s.bg, color:s.color, fontSize:'13px', fontWeight:700, border:`1px solid ${s.color}40` }}>
                          <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:s.color }} />
                          {s.label}
                        </div>
                        {isMatched && report.matchScore && (
                          <div style={{ fontSize:'12px', fontWeight:800, color:'#10B981', background:'rgba(16,185,129,0.1)', padding:'4px 10px', borderRadius:'8px' }}>
                            {report.matchScore}% Match
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Bottom Row: Actions */}
                    <div style={{ display:'flex', justifyContent:'flex-end', gap:'12px', marginTop:'8px', borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:'16px' }}>
                      <button 
                        onClick={() => setViewModal({ isOpen: true, report })}
                        style={{ padding:'8px 16px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--color-text-secondary)', fontSize:'13px', fontWeight:600, cursor:'pointer' }} 
                        onMouseEnter={e=>e.currentTarget.style.color='#fff'} 
                        onMouseLeave={e=>e.currentTarget.style.color='var(--color-text-secondary)'}
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => setEditModal({ isOpen: true, report })}
                        style={{ padding:'8px 16px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--color-text-secondary)', fontSize:'13px', fontWeight:600, cursor:'pointer' }} 
                        onMouseEnter={e=>e.currentTarget.style.color='#fff'} 
                        onMouseLeave={e=>e.currentTarget.style.color='var(--color-text-secondary)'}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, reportId: report.id, itemName: report.itemName })}
                        style={{ padding:'8px 16px', borderRadius:'8px', border:'none', background:'rgba(244,63,94,0.1)', color:'#F43F5E', fontSize:'13px', fontWeight:600, cursor:'pointer' }}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(244,63,94,0.2)'}
                        onMouseLeave={e=>e.currentTarget.style.background='rgba(244,63,94,0.1)'}
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ padding:'60px 20px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', background:'var(--color-card)', border:'1px dashed rgba(255,255,255,0.1)', borderRadius:'16px' }}>
                <div style={{ width:'64px', height:'64px', borderRadius:'16px', background:'rgba(255,255,255,0.03)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'16px' }}>
                  <svg viewBox="0 0 24 24" fill="none" width="32" height="32" color="var(--color-text-muted)"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 style={{ fontSize:'18px', fontWeight:700, color:'var(--color-text-primary)', marginBottom:'8px' }}>No reports found</h3>
                <p style={{ fontSize:'14px', color:'var(--color-text-secondary)' }}>You don't have any {activeTab.toLowerCase()} at the moment.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  )
}
