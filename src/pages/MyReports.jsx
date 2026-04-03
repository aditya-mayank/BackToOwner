import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import { itemsAPI } from '../api/endpoints.js'
import Skeleton from '../components/Skeleton'

/* ─── Detail Modal ───────────────────────────────────────────────────── */
function DetailModal({ report, onClose }) {
  if (!report) return null
  const statusColor = {
    active: '#4F46E5', matched: '#10B981', resolved: '#94A3B8', archived: '#64748B'
  }[report.status] || '#818CF8'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          style={{ background:'var(--color-card)', border:'1px solid var(--color-card-border)', borderRadius:'24px', padding:'32px', maxWidth:'520px', width:'100%', boxShadow:'0 24px 64px rgba(0,0,0,0.4)' }}
        >
          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px' }}>
            <div>
              <h2 style={{ fontSize:'22px', fontWeight:800, color:'var(--color-text-primary)', marginBottom:'6px' }}>{report.itemName}</h2>
              <span style={{ fontSize:'11px', fontWeight:700, padding:'3px 10px', borderRadius:'20px', background:`${statusColor}18`, color:statusColor, textTransform:'uppercase', letterSpacing:'0.05em' }}>
                {report.status}
              </span>
            </div>
            <button onClick={onClose} style={{ background:'rgba(255,255,255,0.06)', border:'none', borderRadius:'10px', width:'36px', height:'36px', cursor:'pointer', color:'var(--color-text-muted)', fontSize:'18px', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
          </div>

          {/* Image */}
          {report.imageUrl && (
            <img src={report.imageUrl} alt={report.itemName}
              style={{ width:'100%', height:'180px', objectFit:'cover', borderRadius:'16px', marginBottom:'20px', border:'1px solid var(--color-card-border)' }}
            />
          )}

          {/* Fields */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'20px' }}>
            {[
              { label:'Type',     value: report.type },
              { label:'Category', value: report.category },
              { label:'Location', value: report.location },
              { label:'Date',     value: report.date },
              { label:'Visibility', value: report.visibility || '—' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize:'10px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'3px' }}>{label}</p>
                <p style={{ fontSize:'14px', fontWeight:600, color:'var(--color-text-primary)', textTransform:'capitalize' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {report.description && (
            <div style={{ padding:'16px', background:'rgba(255,255,255,0.03)', borderRadius:'12px', border:'1px solid var(--color-card-border)' }}>
              <p style={{ fontSize:'11px', fontWeight:700, color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'8px' }}>Description</p>
              <p style={{ fontSize:'14px', color:'var(--color-text-secondary)', lineHeight:1.7 }}>{report.description}</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function MyReports() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Lost Reports')
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState(null)

  useEffect(() => {
    if (!user) return;
    async function loadReports() {
      try {
        const qId = user._id || user.userId || user.id;
        const res = await itemsAPI.searchItems({ reportedBy: qId, status: 'all' });
        const mapped = (res.results || []).map(item => ({
          id: item._id,
          type: item.type,
          status: (item.status || '').toLowerCase(),
          itemName: item.title,
          category: item.category,
          location: item.location,
          date: new Date(item.createdAt).toLocaleDateString(),
          description: item.description,
          imageUrl: item.imageUrl,
          visibility: item.visibility,
        }));
        setReports(mapped);
      } catch (err) {
        console.error('Fetch reports error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, [user]);

  const filtered = reports.filter(r => {
    if (activeTab === 'Lost Reports') return r.type === 'lost' && r.status !== 'resolved'
    if (activeTab === 'Found Reports') return r.type === 'found' && r.status !== 'resolved'
    if (activeTab === 'Resolved') return r.status === 'resolved'
    return true
  })

  return (
    <DashboardLayout>
      <DetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      <div style={{ maxWidth:'900px', margin:'0 auto' }}>
        <h1 style={{ fontSize:'32px', fontWeight:800, color:'var(--color-text-primary)' }}>My Reports</h1>
        <div style={{ display:'flex', gap:'12px', margin:'24px 0', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:'16px' }}>
          {['Lost Reports', 'Found Reports', 'Resolved'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{ padding:'10px 20px', borderRadius:'20px', border:'none', background: activeTab === t ? 'rgba(79,70,229,0.15)' : 'transparent', color: activeTab === t ? '#818CF8' : 'var(--color-text-muted)', fontWeight:600, cursor:'pointer' }}>{t}</button>
          ))}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          {loading ? [1,2].map(i => <Skeleton key={i} height="88px" borderRadius="16px" />) : (
            filtered.length > 0 ? filtered.map(report => {
              const isMatched = report.status === 'matched';
              const isResolved = report.status === 'resolved';
              return (
                <div key={report.id} style={{ padding:'24px', borderRadius:'16px', background:'var(--color-card)', border:'1px solid var(--color-card-border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <h3 style={{ fontSize:'18px', fontWeight:700, color:'var(--color-text-primary)' }}>{report.itemName}</h3>
                    <p style={{ fontSize:'13px', color:'var(--color-text-secondary)' }}>{report.category} • {report.location} • {report.date}</p>
                    <span style={{ fontSize:'11px', fontWeight:700, color: isMatched ? '#10B981' : isResolved ? '#94A3B8' : '#4F46E5', textTransform:'uppercase' }}>{report.status}</span>
                  </div>
                  <div style={{ display:'flex', gap:'10px' }}>
                    {isMatched && <button onClick={() => navigate('/chats')} style={{ padding:'8px 16px', borderRadius:'8px', background:'#4F46E5', color:'#fff', border:'none', fontWeight:700, cursor:'pointer' }}>💬 Go to Chat</button>}
                    <button
                      onClick={() => setSelectedReport(report)}
                      style={{ padding:'8px 16px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'var(--color-text-secondary)', cursor:'pointer', fontWeight:600, fontSize:'13px' }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              )
            }) : <p style={{ textAlign:'center', color:'var(--color-text-muted)', padding:'40px' }}>No reports in this category.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
