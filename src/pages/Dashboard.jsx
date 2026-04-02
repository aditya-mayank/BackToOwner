import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import { itemsAPI } from '../api/endpoints.js'

/* ─── Count-Up Hook ──────────────────────────────────────────────────── */
function StatCard({ label, target, suffix, colorFrom, colorTo, glowColor, icon, delay, trigger }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!trigger) return
    let start = 0
    const end = parseInt(target) || 0
    if (start === end) { setCount(end); return }
    let duration = 2000
    let stepTime = Math.abs(Math.floor(duration / (end || 1)))
    let timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      }
    }, Math.min(stepTime, 100))
    return () => clearInterval(timer)
  }, [target, trigger])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      style={{
        flex: '1 1 200px', padding: '24px', borderRadius: '24px',
        background: 'var(--color-card)', border: '1px solid var(--color-card-border)',
        boxShadow: 'var(--card-shadow)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: glowColor, filter: 'blur(30px)', pointerEvents: 'none' }}/>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${colorFrom}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorFrom }}>
          {icon}
        </div>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span style={{ fontSize: '36px', fontWeight: 900, color: 'var(--color-text-primary)', letterSpacing: '-0.04em' }}>{count}</span>
        <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-muted)' }}>{suffix}</span>
      </div>
    </motion.div>
  )
}

/* ─── Quick Card ─────────────────────────────────────────────────────── */
function QuickCard({ label, sub, href, colorFrom, colorTo, glowColor, icon, delay }) {
  const navigate = useNavigate()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={() => navigate(href)}
      style={{
        flex: '1 1 300px', padding: '32px', borderRadius: '28px',
        background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})`,
        border: '1px solid rgba(255,255,255,0.1)',
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(40px)', pointerEvents: 'none' }}/>
      
      <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
        {icon}
      </div>
      
      <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '10px', letterSpacing: '-0.02em' }}>{label}</h3>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, fontWeight: 500 }}>{sub}</p>
      
      <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '13px', fontWeight: 700 }}>
         Get Started <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </motion.div>
  )
}

/* ─── Activity Item ──────────────────────────────────────────────────── */
function ActivityItem({ item, index, total }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      style={{
        display: 'flex', gap: '14px', alignItems: 'flex-start',
        padding: '18px 0',
        borderBottom: index < total - 1 ? '1px solid var(--color-card-border)' : 'none',
      }}
    >
      <div style={{
        width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
        background: `${item.color}14`,
        border: `1px solid ${item.color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px', position: 'relative',
      }}>
        {item.icon}
        <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '9px', height: '9px', borderRadius: '50%', background: item.color, border: '2px solid var(--color-card)' }}/>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '14px', color: 'var(--color-text-primary)', lineHeight: 1.6, fontWeight: 500, marginBottom: '4px' }}>
          {item.text}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '6px', background: `${item.color}14`, color: item.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {item.type}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{item.time}</span>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Skeleton ────────────────────────────────────────────────────────── */
function SkeletonItem() {
  return (
    <div style={{ padding: '18px 0', display: 'flex', gap: '14px', alignItems: 'center', borderBottom: '1px solid var(--color-card-border)' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }} className="skeleton-animate" />
      <div style={{ flex: 1 }}>
        <div style={{ height: '14px', width: '70%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '8px' }} className="skeleton-animate" />
        <div style={{ height: '10px', width: '30%', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }} className="skeleton-animate" />
      </div>
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)
  const [dynamicStats, setDynamicStats] = useState({ active: 0, matches: 0, resolved: 0, daysActive: 1 })
  const [dynamicActivity, setDynamicActivity] = useState([])

  const fetchDashboardData = async () => {
    try {
      if (!user) return;
      const qId = user._id || user.userId || user.id;
      const [pRes, cRes] = await Promise.all([
        itemsAPI.searchItems({ reportedBy: qId, status: 'all' }),
        itemsAPI.searchItems({ status: 'all' })
      ]);

      const personalItems = pRes.results || [];
      const campusItems = cRes.results || [];

      // Accurate Stats from DB
      const active = personalItems.filter(i => (i.status || '').toLowerCase() === 'active').length;
      const matched = personalItems.filter(i => (i.status || '').toLowerCase() === 'matched').length;
      const resolved = campusItems.filter(i => (i.status || '').toLowerCase() === 'resolved').length;
      
      const creation = new Date(user.createdAt || Date.now());
      const days = Math.max(1, Math.floor((Date.now() - creation.getTime()) / (1000 * 3600 * 24)));

      setDynamicStats({ active, matches: matched, resolved, daysActive: days });

      const mappedActs = personalItems.slice(0, 6).map((item) => ({
        id: item._id,
        icon: item.type === 'lost' ? '🔑' : '📦',
        text: `You reported a ${item.type} ${item.category}: "${item.title}" at ${item.location}.`,
        time: new Date(item.createdAt).toLocaleDateString(),
        color: item.type === 'lost' ? '#7C3AED' : '#4F46E5',
        type: (item.status || 'Report').toUpperCase()
      }));
      
      setDynamicActivity(mappedActs);
    } catch (err) {
      console.error('[Dashboard] Sync Error:', err);
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr  = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const STATS = [
    { label: 'Active Reports', target: dynamicStats.active, suffix: '', colorFrom: '#4F46E5', colorTo: '#6366F1', glowColor: 'rgba(79,70,229,0.2)', icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
    { label: 'Matches Found', target: dynamicStats.matches, suffix: '', colorFrom: '#10B981', colorTo: '#34D399', glowColor: 'rgba(16,185,129,0.2)', icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg> },
    { label: 'Items Resolved', target: dynamicStats.resolved, suffix: '', colorFrom: '#7C3AED', colorTo: '#8B5CF6', glowColor: 'rgba(124,58,237,0.2)', icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { label: 'Days Active', target: dynamicStats.daysActive, suffix: '', colorFrom: '#F59E0B', colorTo: '#FBBF24', glowColor: 'rgba(245,158,11,0.2)', icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  ]

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Student Dashboard</p>
            <h1 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--color-text-primary)', lineHeight: 1.1 }}>
              {greeting}, {user?.name?.split(' ')[0]} 👋
            </h1>
          </div>
          <div style={{ padding: '10px 18px', borderRadius: '14px', fontSize: '13px', fontWeight: 600, background: 'var(--color-card)', border: '1px solid var(--color-card-border)', color: 'var(--color-text-secondary)', boxShadow: 'var(--card-shadow)' }}>
            {dateStr}
          </div>
        </motion.div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '48px' }}>
          {STATS.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.12} trigger={loaded} />)}
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '20px' }}>Quick Actions</motion.p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '56px' }}>
          <QuickCard label="I Lost Something" sub="File a detailed report. Our AI matching engine will immediately scan all found items." href="/report-lost" colorFrom="#4F46E5" colorTo="#6366F1" glowColor="rgba(79,70,229,0.4)" delay={0.45} icon={<svg viewBox="0 0 24 24" fill="none" width="28" height="28"><circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2.5"/><path d="m21 21-4.35-4.35M11 8v3m0 0v3m0-3H8m3 0h3" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>} />
          <QuickCard label="I Found Something" sub="Help a fellow Warrior. Submit found items and let us notify the rightful owner." href="/report-found" colorFrom="#10B981" colorTo="#34D399" glowColor="rgba(16,185,129,0.4)" delay={0.55} icon={<svg viewBox="0 0 24 24" fill="none" width="28" height="28"><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h7" stroke="white" strokeWidth="2.5"/><path d="M16 19h6M19 16v6" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ background: 'var(--color-card)', border: '1px solid var(--color-card-border)', borderRadius: '28px', padding: '32px', boxShadow: 'var(--card-shadow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-primary)' }}>Your Recent Activity</h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Real-time synchronization with campus reports</p>
            </div>
            <div style={{ padding: '6px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 800, background: 'rgba(79,70,229,0.1)', color: '#818CF8', border: '1px solid rgba(79,70,229,0.2)' }}>
              {dynamicActivity.length} Events
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            {loaded ? (
              dynamicActivity.length > 0 ? dynamicActivity.map((item, i) => <ActivityItem key={item.id} item={item} index={i} total={dynamicActivity.length} />) : <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '14px' }}>No reports recorded yet. Start by filing a report!</div>
            ) : [1, 2, 3].map(i => <SkeletonItem key={i} />)}
          </div>
          <button onClick={() => navigate('/my-reports')} style={{ width: '100%', marginTop: '24px', padding: '14px', borderRadius: '16px', border: '1px solid var(--color-card-border)', background: 'transparent', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: 'var(--color-text-secondary)', transition: 'all 0.3s' }} onMouseEnter={e => {e.currentTarget.style.background='rgba(79,70,229,0.05)'; e.currentTarget.style.borderColor='rgba(79,70,229,0.3)'; e.currentTarget.style.color='#818CF8'}} onMouseLeave={e => {e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='var(--color-card-border)'; e.currentTarget.style.color='var(--color-text-secondary)'}}>
            Explore all reports →
          </button>
        </motion.div>

        <style>{`
          @keyframes skeleton-pulse {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
          }
          .skeleton-animate {
            animation: skeleton-pulse 1.5s infinite ease-in-out;
          }
        `}</style>
      </div>
    </DashboardLayout>
  )
}
