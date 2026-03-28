import React, { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '../components/DashboardLayout'
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
/* ─── Mock Data ──────────────────────────────────────────────────────── */
const INITIAL_NOTIFS = [
  {
    id: 1, type: 'match', read: false, timeAgo: '2 mins ago',
    title: 'Match Found: Grey Nike Backpack',
    desc: 'Our AI has identified a highly probable match for your lost item.',
    matchDetails: {
      score: 85,
      yours: { category: '🎒 Bags', location: 'Library', date: '28 Mar 2026' },
      theirs: { category: '🎒 Bags', location: 'Library', date: '28 Mar 2026' }
    }
  },
  {
    id: 2, type: 'system', read: false, timeAgo: '1 day ago',
    title: 'Report Published',
    desc: 'Your "Grey Nike Backpack" lost report is now active globally.'
  },
  {
    id: 3, type: 'system', read: true, timeAgo: '3 days ago',
    title: 'Welcome to BackToOwner!',
    desc: 'Thanks for joining NITW\'s smart campus recovery system!'
  }
]
/* ─── Circular Score Ring ────────────────────────────────────────────── */
function ScoreRing({ score }) {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    let start = 0
    const end = score
    if (start === end) return
    const ms = 20
    const stepTime = Math.abs(Math.floor(ms / end))
    const timer = setInterval(() => {
      start += 1
      setCurrent(start)
      if (start === end) clearInterval(timer)
    }, stepTime)
    return () => clearInterval(timer)
  }, [score])
  const radius = 30
  const circumference = 2 * Math.PI * radius
  const strokeOffset = circumference - (current / 100) * circumference
  return (
    <div style={{ position:'relative', width:'80px', height:'80px', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <svg width="80" height="80" style={{ position:'absolute', transform:'rotate(-90deg)' }}>
        <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="6" />
        <motion.circle
          cx="40" cy="40" r={radius} fill="none" stroke="#10B981" strokeWidth="6"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: strokeOffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
        <span style={{ fontSize:'20px', fontWeight:800, color:'#34D399', lineHeight:1 }}>{current}<span style={{fontSize:'12px'}}>%</span></span>
        <span style={{ fontSize:'9px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', color:'var(--color-text-muted)' }}>Match</span>
      </div>
    </div>
  )
}
/* ─── Match Alert Card (SPECIAL!) ────────────────────────────────────── */
function MatchAlertCard({ notif }) {
  const navigate = useNavigate()
  useEffect(() => {
    if (!notif.read) triggerConfetti()
  }, [notif.read])
  const { yours, theirs, score } = notif.matchDetails
  return (
    <motion.div
      initial={{ opacity:0, scale:0.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
      style={{
        background:'rgba(16,185,129,0.04)', borderRadius:'24px', position:'relative', overflow:'hidden',
        border:'1px solid rgba(16,185,129,0.25)', boxShadow:'0 12px 40px rgba(0,0,0,0.3)',
        padding:'32px', marginBottom:'32px', display:'flex', flexDirection:'column', gap:'24px'
      }}
    >
      {/* Glow */}
      <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'200px', height:'200px', borderRadius:'50%', background:'rgba(16,185,129,0.15)', filter:'blur(50px)', pointerEvents:'none' }} />
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <div style={{ width:'56px', height:'56px', borderRadius:'16px', background:'linear-gradient(135deg,#10B981,#059669)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 24px rgba(16,185,129,0.5)', color:'#fff' }}>
            <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <h2 style={{ fontSize:'24px', fontWeight:800, color:'#10B981', letterSpacing:'-0.03em', marginBottom:'4px' }}>We found a potential match!</h2>
            <p style={{ fontSize:'14px', color:'var(--color-text-secondary)' }}>{notif.title}</p>
          </div>
        </div>
        <ScoreRing score={score} />
      </div>
      {/* Info Rows Side-by-Side */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', position:'relative', zIndex:1 }}>
        {/* Your Item */}
        <div style={{ background:'var(--color-card)', padding:'20px', borderRadius:'16px', border:'1px dashed rgba(255,255,255,0.1)' }}>
          <p style={{ fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', color:'var(--color-text-muted)', marginBottom:'12px' }}>Your Lost Report</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{fontSize:'13px', color:'var(--color-text-secondary)'}}>Category</span><span style={{fontSize:'13px', fontWeight:600, color:'var(--color-text-primary)'}}>{yours.category}</span></div>
            <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{fontSize:'13px', color:'var(--color-text-secondary)'}}>Location</span><span style={{fontSize:'13px', fontWeight:600, color:'var(--color-text-primary)'}}>{yours.location}</span></div>
            <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{fontSize:'13px', color:'var(--color-text-secondary)'}}>Date</span><span style={{fontSize:'13px', fontWeight:600, color:'var(--color-text-primary)'}}>{yours.date}</span></div>
          </div>
        </div>
        {/* Their Item */}
        <div style={{ background:'var(--color-card)', padding:'20px', borderRadius:'16px', border:'1px dashed rgba(16,185,129,0.3)' }}>
          <p style={{ fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', color:'#34D399', marginBottom:'12px' }}>Matched Found Item</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{fontSize:'13px', color:'var(--color-text-secondary)'}}>Category</span><span style={{fontSize:'13px', fontWeight:600, color:'var(--color-text-primary)'}}>{theirs.category}</span></div>
            <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{fontSize:'13px', color:'var(--color-text-secondary)'}}>Location</span><span style={{fontSize:'13px', fontWeight:600, color:'var(--color-text-primary)'}}>{theirs.location}</span></div>
            <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{fontSize:'13px', color:'var(--color-text-secondary)'}}>Date</span><span style={{fontSize:'13px', fontWeight:600, color:'var(--color-text-primary)'}}>{theirs.date}</span></div>
          </div>
        </div>
      </div>
      {/* Privacy Lock Banner */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'12px', borderRadius:'12px', background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', position:'relative', zIndex:1 }}>
        <svg viewBox="0 0 24 24" fill="none" width="16" height="16" color="#F59E0B"><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        <span style={{ fontSize:'13px', fontWeight:600, color:'#F59E0B' }}>Finder identity protected until you connect.</span>
      </div>
      {/* Buttons */}
      <div style={{ display:'flex', gap:'12px', position:'relative', zIndex:1 }}>
        <motion.button
          onClick={() => navigate('/chat/123')}
          whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
          style={{ flex:1, padding:'16px', borderRadius:'12px', border:'none', background:'linear-gradient(135deg,#4F46E5,#6366F1)', color:'#fff', fontSize:'15px', fontWeight:800, cursor:'pointer', boxShadow:'0 4px 20px rgba(79,70,229,0.4)' }}
        >
          Open Secure Chat
        </motion.button>
        <motion.button
          whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
          style={{ padding:'16px 24px', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.1)', background:'var(--color-card)', color:'var(--color-text-secondary)', fontSize:'14px', fontWeight:600, cursor:'pointer' }}
        >
          Not a match? Report this.
        </motion.button>
      </div>
    </motion.div>
  )
}
/* ─── Standard Notification Card ─────────────────────────────────────── */
function NotificationCard({ notif, onMarkRead }) {
  const isMatch = notif.type === 'match'
  return (
    <div
      onClick={() => { if(!notif.read) onMarkRead(notif.id) }}
      style={{
        display:'flex', gap:'16px', padding:'20px', borderRadius:'16px', cursor:'pointer',
        background: notif.read ? 'transparent' : 'var(--color-card)',
        borderLeft: `4px solid ${isMatch ? '#10B981' : '#4F46E5'}`,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        transition:'all .2s'
      }}
    >
      {/* Icon */}
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
          <h3 style={{ fontSize:'15px', fontWeight:notif.read ? 600 : 700, color:'var(--color-text-primary)', display:'flex', alignItems:'center', gap:'8px' }}>
            {notif.title}
            {!notif.read && (
              <motion.div
                animate={{ scale:[1,1.5,1], opacity:[1,0.5,1] }} transition={{ duration:2, repeat:Infinity }}
                style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#4F46E5' }}
              />
            )}
          </h3>
          <span style={{ fontSize:'12px', color:'var(--color-text-muted)', whiteSpace:'nowrap' }}>{notif.timeAgo}</span>
        </div>
        <p style={{ fontSize:'13px', color:'var(--color-text-secondary)', lineHeight:1.5 }}>
          {notif.desc}
        </p>
      </div>
    </div>
  )
}
/* ─── Main Page Component ────────────────────────────────────────────── */
export default function Notifications() {
  const [activeTab, setActiveTab] = useState('All')
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS)
  const TABS = ['All', 'Matches', 'System', 'Read']
  const filtered = notifs.filter(n => {
    if (activeTab === 'Matches') return n.type === 'match'
    if (activeTab === 'System') return n.type === 'system'
    if (activeTab === 'Read') return n.read === true
    return true
  })
  // Extract top unread match for the special card, if activeTab is 'All' or 'Matches'
  const specialMatch = filtered.find(n => n.type === 'match' && !n.read)
  // The rest of the list
  const listItems = specialMatch ? filtered.filter(n => n.id !== specialMatch.id) : filtered
  const markAllRead = () => {
    setNotifs(notifs.map(n => ({ ...n, read: true })))
  }
  const markRead = (id) => {
    setNotifs(notifs.map(n => n.id === id ? { ...n, read: true } : n))
  }
  return (
    <DashboardLayout>
      <div style={{ maxWidth:'760px', margin:'0 auto' }}>
        {/* Header Options */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'32px' }}>
          <div>
            <h1 style={{ fontSize:'clamp(24px,3vw,32px)', fontWeight:800, letterSpacing:'-0.03em', color:'var(--color-text-primary)' }}>
              Notifications
            </h1>
            <p style={{ fontSize:'14px', color:'var(--color-text-secondary)' }}>You have <strong style={{color:'#fff'}}>{notifs.filter(n=>!n.read).length}</strong> unread messages.</p>
          </div>
          <button
            id="mark-all-read-btn"
            onClick={markAllRead}
            style={{ padding:'8px 16px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'var(--color-text-secondary)', fontSize:'13px', fontWeight:600, cursor:'pointer', transition:'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.color='#fff'; e.currentTarget.style.background='rgba(255,255,255,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.color='var(--color-text-secondary)'; e.currentTarget.style.background='rgba(255,255,255,0.05)' }}
          >
            Mark all as read
          </button>
        </div>
        {/* Tabs */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'32px', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:'16px' }}>
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
