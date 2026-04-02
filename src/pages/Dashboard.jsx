import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import { itemsAPI } from '../api/endpoints.js'
/* ─── Count-Up Hook ──────────────────────────────────────────────────── */
/* ─── Activity Item ──────────────────────────────────────────────────── */
function ActivityItem({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      style={{
        display: 'flex', gap: '14px', alignItems: 'flex-start',
        padding: '14px 0',
        borderBottom: index < ACTIVITY.length - 1 ? '1px solid var(--color-card-border)' : 'none',
      }}
    >
      {/* Icon bubble */}
      <div style={{
        width: '38px', height: '38px', borderRadius: '12px', flexShrink: 0,
        background: `${item.color}14`,
        border: `1px solid ${item.color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '16px', position: 'relative',
      }}>
        {item.icon}
        {/* Dot */}
        <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '9px', height: '9px', borderRadius: '50%', background: item.color, border: '2px solid var(--color-card)' }}/>
      </div>
      {/* Text */}
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '14px', color: 'var(--color-text-primary)', lineHeight: 1.55, fontWeight: 500, marginBottom: '4px' }}>
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
/* ─── Dashboard Page ─────────────────────────────────────────────────── */
export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [loaded, setLoaded] = useState(false)
  const [dynamicStats, setDynamicStats] = useState({ active: 0, matches: 0, resolved: 0, daysActive: 1 })
  const [dynamicActivity, setDynamicActivity] = useState([])

  useEffect(() => {
    if (!user) return;
    async function fetchDashboardData() {
      try {
        const queryId = user._id || user.userId || user.id
        if (!queryId) return;

        const res = await itemsAPI.searchItems({ reportedBy: queryId });
        const items = res.items || [];
        
        const active = items.filter(i => i.status !== 'resolved').length;
        const resolved = items.filter(i => i.status === 'resolved').length;
        
        const creation = new Date(user.createdAt || Date.now());
        const days = Math.max(1, Math.floor((Date.now() - creation.getTime()) / (1000 * 3600 * 24)));

        setDynamicStats({ active, matches: 0, resolved, daysActive: days });

        const mappedActs = items.slice(0, 6).map((item, idx) => ({
          id: item._id,
          icon: item.type === 'lost' ? '🔑' : '📦',
          text: `You filed a ${item.type} report for "${item.title}" at ${item.location}.`,
          time: new Date(item.createdAt).toLocaleDateString(),
          color: item.type === 'lost' ? '#7C3AED' : '#4F46E5',
          type: 'report'
        }));
        
        setDynamicActivity(mappedActs);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoaded(true);
      }
    }
    fetchDashboardData();
  }, [user]);

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr  = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const firstName = user?.name?.split(' ')[0] || 'Student'
  
  const STATS = [
    {
      label: 'Active Reports', target: dynamicStats.active, suffix: '',
      colorFrom: '#4F46E5', colorTo: '#6366F1', glowColor: 'rgba(79,70,229,0.2)',
      icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    },
    {
      label: 'Matches Found', target: dynamicStats.matches, suffix: '',
      colorFrom: '#10B981', colorTo: '#34D399', glowColor: 'rgba(16,185,129,0.2)',
      icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
    },
    {
      label: 'Items Resolved', target: dynamicStats.resolved, suffix: '',
      colorFrom: '#7C3AED', colorTo: '#8B5CF6', glowColor: 'rgba(124,58,237,0.2)',
      icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    },
    {
      label: 'Days Active', target: dynamicStats.daysActive, suffix: '',
      colorFrom: '#F59E0B', colorTo: '#FBBF24', glowColor: 'rgba(245,158,11,0.2)',
      icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    },
  ]
  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1100px' }}>
        {/* ── Page Header ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '32px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}
        >
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Dashboard</p>
            <h1 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-text-primary)', lineHeight: 1.1 }}>
              {greeting}, {firstName} 👋
            </h1>
          </div>
          <div style={{
            padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 500,
            background: 'var(--color-card)', border: '1px solid var(--color-card-border)',
            color: 'var(--color-text-secondary)',
          }}>
            {dateStr}
          </div>
        </motion.div>
        {/* ── Stats Row ────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          {STATS.map((s, i) => (
            <StatCard key={s.label} {...s} delay={i * 0.1} trigger={true} />
          ))}
        </div>
        {/* ── Quick Actions ─────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.07em', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '14px' }}
        >
          Quick Actions
        </motion.p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '36px' }}>
          <QuickCard
            label="I Lost Something"
            sub="File a report. Our AI will instantly start scanning found items."
            href="/report-lost"
            colorFrom="#4F46E5" colorTo="#6366F1"
            glowColor="rgba(79,70,229,0.35)"
            delay={0.35}
            icon={<svg viewBox="0 0 24 24" fill="none" width="24" height="24"><circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2"/><path d="m21 21-4.35-4.35M11 8v3m0 0v3m0-3H8m3 0h3" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>}
          />
          <QuickCard
            label="I Found Something"
            sub="Submit what you found. Help a fellow Warrior recover their item."
            href="/report-found"
            colorFrom="#059669" colorTo="#10B981"
            glowColor="rgba(16,185,129,0.35)"
            delay={0.45}
            icon={<svg viewBox="0 0 24 24" fill="none" width="24" height="24"><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h7" stroke="white" strokeWidth="2"/><path d="M16 19h6M19 16v6" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>}
          />
        </div>
        {/* ── Activity Feed ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-card-border)',
            borderRadius: '22px',
            padding: '24px 24px',
          }}
        >
          {/* Feed header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>Recent Activity</h2>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>Your latest interactions on the platform</p>
            </div>
            <span style={{
              padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
              background: 'rgba(79,70,229,0.1)', color: '#818CF8',
              border: '1px solid rgba(79,70,229,0.2)',
            }}>
              {dynamicActivity.length} events
            </span>
          </div>
          <div style={{ marginTop: '8px' }}>
            {loaded
              ? dynamicActivity.length > 0 
                ? dynamicActivity.map((item, i) => <ActivityItem key={item.id} item={item} index={i} />)
                : <p style={{ fontSize:'13px', color:'var(--color-text-muted)', textAlign:'center', padding:'20px 0' }}>No activity logged yet. Report an item to begin!</p>
              : [1, 2, 3, 4].map(i => <SkeletonItem key={i} />)
            }
          </div>
          {loaded && (
            <motion.button
              onClick={() => navigate('/my-reports')}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              id="view-all-activity-btn"
              style={{
                width: '100%', marginTop: '16px', padding: '11px',
                borderRadius: '12px', border: '1px solid var(--color-card-border)',
                background: 'transparent', cursor: 'pointer', fontSize: '13px',
                fontWeight: 600, color: 'var(--color-text-secondary)',
                transition: 'all .2s',
              }}
              whileHover={{ background: 'rgba(79,70,229,0.08)', color: '#818CF8', borderColor: 'rgba(79,70,229,0.3)' }}
            >
              View all activity →
            </motion.button>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
