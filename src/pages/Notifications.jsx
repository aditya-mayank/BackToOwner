import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '../components/DashboardLayout'
import { notificationAPI } from '../api/endpoints.js'

/* ─── Confetti ───────────────────────────────────────────────────────── */
function triggerConfetti() {
  const colors = ['#4F46E5','#10B981','#F43F5E','#F59E0B','#8B5CF6','#06B6D4']
  for (let i = 0; i < 120; i++) {
    const el = document.createElement('div')
    const size = Math.random() * 9 + 4
    const isRect = Math.random() > 0.5
    el.style.cssText = `position:fixed;z-index:9999;pointer-events:none;width:${size}px;height:${isRect ? size * 0.4 : size}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${isRect?'2px':'50%'};left:${Math.random()*100}vw;top:-12px`
    document.body.appendChild(el)
    el.animate([
      { transform:'translateY(0) rotate(0deg) scale(1)', opacity:1 },
      { transform:`translateY(${Math.random()*80+50}vh) rotate(${Math.random()*720-360}deg) scale(0.3)`, opacity:0 },
    ],{ duration:Math.random()*1200+800, delay:Math.random()*400, easing:'cubic-bezier(0.215,0.61,0.355,1)' })
    .onfinish = () => el.remove()
  }
}

/* ─── Match Alert Card (SPECIAL!) ────────────────────────────────────── */
function MatchAlertCard({ notif }) {
  const navigate = useNavigate()
  useEffect(() => {
    if (notif.status === 'unread') triggerConfetti()
  }, [notif.status])

  return (
    <motion.div
      initial={{ opacity:0, scale:0.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
      style={{
        background:'rgba(16,185,129,0.04)', borderRadius:'24px', position:'relative', overflow:'hidden',
        border:'1px solid rgba(16,185,129,0.25)', boxShadow:'0 12px 40px rgba(0,0,0,0.3)',
        padding:'32px', marginBottom:'32px', display:'flex', flexDirection:'column', gap:'16px'
      }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
        <div style={{ width:'56px', height:'56px', borderRadius:'16px', background:'linear-gradient(135deg,#10B981,#059669)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
          <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div>
          <h2 style={{ fontSize:'20px', fontWeight:800, color:'#10B981', letterSpacing:'-0.03em', marginBottom:'4px' }}>Match Update!</h2>
          <p style={{ fontSize:'14px', color:'var(--color-text-secondary)' }}>{notif.message}</p>
        </div>
      </div>
      <div style={{ display:'flex', gap:'12px' }}>
        <button 
          onClick={() => navigate('/chats')}
          style={{ flex:1, padding:'12px', borderRadius:'12px', border:'none', background:'#4F46E5', color:'#fff', fontWeight:700, cursor:'pointer' }}
        >
          Go to Chat
        </button>
      </div>
    </motion.div>
  )
}
/* ─── Standard Notification Card ─────────────────────────────────────── */
function NotificationCard({ notif, onMarkRead }) {
  const isMatch = notif.type === 'match'
  const isRead = notif.status === 'read'
  return (
    <div
      onClick={() => { if(!isRead) onMarkRead(notif._id) }}
      style={{
        display:'flex', gap:'16px', padding:'20px', borderRadius:'16px', cursor:'pointer',
        background: isRead ? 'transparent' : 'var(--color-card)',
        borderLeft: `4px solid ${isMatch ? '#10B981' : '#4F46E5'}`,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        transition:'all .2s'
      }}
    >
      <div style={{
        width:'40px', height:'40px', borderRadius:'10px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
        background: isMatch ? 'rgba(16,185,129,0.15)' : 'rgba(79,70,229,0.15)',
        color: isMatch ? '#10B981' : '#818CF8'
      }}>
        {isMatch 
          ? <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          : <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        }
      </div>
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'4px' }}>
          <h3 style={{ fontSize:'15px', fontWeight:isRead ? 600 : 700, color:'var(--color-text-primary)' }}>{notif.title}</h3>
          <span style={{ fontSize:'11px', color:'var(--color-text-muted)' }}>{new Date(notif.createdAt).toLocaleDateString()}</span>
        </div>
        <p style={{ fontSize:'13px', color:'var(--color-text-secondary)', lineHeight:1.5 }}>{notif.message}</p>
      </div>
    </div>
  )
}
/* ─── Main Page Component ────────────────────────────────────────────── */
export default function Notifications() {
  const [activeTab, setActiveTab] = useState('All')
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotifs = async () => {
    try {
      const res = await notificationAPI.getMy()
      if (res.success) setNotifs(res.notifications)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifs()
  }, [])

  const markRead = async (id) => {
    try {
      setNotifs(prev => prev.map(n => n._id === id ? { ...n, status: 'read' } : n))
      await notificationAPI.markRead(id)
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }

  const filtered = notifs.filter(n => {
    if (activeTab === 'Matches') return n.type === 'match'
    if (activeTab === 'Unread') return n.status === 'unread'
    if (activeTab === 'Read') return n.status === 'read'
    return true
  })

  const specialMatch = filtered.find(n => n.type === 'match' && n.status === 'unread')
  const listItems = specialMatch ? filtered.filter(n => n._id !== specialMatch._id) : filtered
  const TABS = ['All', 'Matches', 'Unread', 'Read']

  return (
    <DashboardLayout>
      <div style={{ maxWidth:'760px', margin:'0 auto' }}>
        {/* Header Options */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'32px', flexWrap:'wrap', gap:'12px' }}>
          <div>
            <h1 style={{ fontSize:'clamp(24px,3vw,32px)', fontWeight:800, letterSpacing:'-0.03em', color:'var(--color-text-primary)' }}>
              Notifications
            </h1>
            <p style={{ fontSize:'14px', color:'var(--color-text-secondary)' }}>You have <strong style={{color:'#fff'}}>{notifs.filter(n=>n.status==='unread').length}</strong> unread messages.</p>
          </div>
        </div>
        {/* Tabs */}
        <div className="tabs-row" style={{ display:'flex', gap:'8px', marginBottom:'32px', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:'16px' }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                padding:'8px 20px', borderRadius:'20px', border:'none', cursor:'pointer',
                fontSize:'14px', fontWeight:600, transition:'all .2s',
                background: activeTab === t ? 'rgba(79,70,229,0.15)' : 'transparent',
                color: activeTab === t ? '#818CF8' : 'var(--color-text-muted)'
              }}
            >
              {t}
            </button>
          ))}
        </div>
        {/* Content */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          <AnimatePresence>
            {specialMatch && (
              <MatchAlertCard key={`special-${specialMatch.id}`} notif={specialMatch} />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {listItems.length > 0 ? (
              listItems.map(notif => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:0.95 }}
                >
                  <NotificationCard notif={notif} onMarkRead={markRead} />
                </motion.div>
              ))
            ) : (
              !specialMatch && (
                <motion.div
                  initial={{ opacity:0 }} animate={{ opacity:1 }}
                  style={{ padding:'80px 20px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center' }}
                >
                  <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:'rgba(255,255,255,0.03)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'24px' }}>
                    <svg viewBox="0 0 24 24" fill="none" width="40" height="40" color="rgba(255,255,255,0.1)"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <h3 style={{ fontSize:'18px', fontWeight:700, color:'var(--color-text-primary)', marginBottom:'8px' }}>No notifications yet</h3>
                  <p style={{ fontSize:'14px', color:'var(--color-text-secondary)', maxWidth:'300px' }}>When you get matches or system alerts, they'll show up right here.</p>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  )
}
