import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import { itemsAPI } from '../api/endpoints.js'
import Skeleton from '../components/Skeleton'

export default function MyReports() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Lost Reports')
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return;
    async function loadReports() {
      try {
        const qId = user._id || user.userId || user.id;
        const res = await itemsAPI.searchItems({ reportedBy: qId });
        const mapped = (res.results || []).map(item => ({
          id: item._id,
          type: item.type,
          status: (item.status || '').toLowerCase(),
          itemName: item.title,
          category: item.category,
          location: item.location,
          date: new Date(item.createdAt).toLocaleDateString(),
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
              return (
                <div key={report.id} style={{ padding:'24px', borderRadius:'16px', background:'var(--color-card)', border:'1px solid var(--color-card-border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <h3 style={{ fontSize:'18px', fontWeight:700 }}>{report.itemName}</h3>
                    <p style={{ fontSize:'13px', color:'var(--color-text-secondary)' }}>{report.category} • {report.location} • {report.date}</p>
                    <span style={{ fontSize:'11px', fontWeight:700, color: isMatched ? '#10B981' : (report.status === 'resolved' ? '#94A3B8' : '#4F46E5'), textTransform:'uppercase' }}>{report.status}</span>
                  </div>
                  <div style={{ display:'flex', gap:'10px' }}>
                    {isMatched && <button onClick={() => navigate('/chats')} style={{ padding:'8px 16px', borderRadius:'8px', background:'#4F46E5', color:'#fff', border:'none', fontWeight:700, cursor:'pointer' }}>💬 Go to Chat</button>}
                    <button style={{ padding:'8px 16px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'#fff', cursor:'pointer' }}>View Details</button>
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
