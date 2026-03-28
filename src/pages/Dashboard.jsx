import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
/* ─── Count-Up Hook ──────────────────────────────────────────────────── */
function useCountUp(target, trigger, duration = 1200) {
  const [count, setCount] = useState(0)
  const raf = useRef(null)
  useEffect(() => {
    if (!trigger) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3) // ease-out cubic
      setCount(Math.floor(e * target))
      if (p < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [trigger, target, duration])
  return count
}
/* ─── Stat Card ──────────────────────────────────────────────────────── */
function StatCard({ label, target, suffix = '', icon, colorFrom, colorTo, glowColor, delay, trigger }) {
  const count = useCountUp(target, trigger, 1100)
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{
        flex: '1 1 160px',
        padding: '22px 20px',
        borderRadius: '20px',
        background: 'var(--color-card)',
        border: '1px solid var(--color-card-border)',
        cursor: 'default',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 12px 40px ${glowColor}`}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.12)'}
    >
      {/* Background blob */}
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '90px', height: '90px', borderRadius: '50%', background: glowColor, filter: 'blur(24px)', pointerEvents: 'none' }}/>
      {/* Icon */}
      <div style={{
        width: '42px', height: '42px', borderRadius: '12px', marginBottom: '16px',
        background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', boxShadow: `0 6px 20px ${glowColor}`,
      }}>
        {icon}
      </div>
      {/* Number */}
      <div style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, color: colorFrom, marginBottom: '6px' }}>
        {count}{suffix}
      </div>
      {/* Label */}
      <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '-0.01em' }}>
        {label}
      </p>
    </motion.div>
  )
}
/* ─── Quick Action Card ──────────────────────────────────────────────── */
function QuickCard({ label, sub, href, colorFrom, colorTo, glowColor, delay, icon }) {
  const navigate = useNavigate()
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(href)}
      style={{
        flex: '1 1 220px',
        padding: '32px 28px',
        borderRadius: '24px',
        background: `linear-gradient(135deg, ${colorFrom}ee, ${colorTo}cc)`,
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
        boxShadow: `0 8px 40px ${glowColor}`,
        border: `1px solid ${colorFrom}40`,
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 16px 60px ${glowColor}`}
      onMouseLeave={e => e.currentTarget.style.boxShadow = `0 8px 40px ${glowColor}`}
    >
      {/* Grid pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
        pointerEvents: 'none',
      }}/>
      {/* Glow orb */}
      <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(30px)', pointerEvents: 'none' }}/>
      {/* Animated icon */}
      <motion.div
        animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ marginBottom: '18px', width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', position: 'relative', zIndex: 1 }}
      >
        {icon}
      </motion.div>
      <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', marginBottom: '6px', position: 'relative', zIndex: 1 }}>
        {label}
      </h3>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
        {sub}
      </p>
      <div style={{ position: 'absolute', bottom: '20px', right: '20px', color: 'rgba(255,255,255,0.5)', zIndex: 1 }}>
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      </div>
    </motion.div>
  )
}
/* ─── Skeleton Loader ────────────────────────────────────────────────── */
function SkeletonItem() {
  return (
    <div style={{ display: 'flex', gap: '14px', padding: '16px 0', borderBottom: '1px solid var(--color-card-border)' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', flexShrink: 0, animation: 'pulse 1.5s ease-in-out infinite' }}/>
      <div style={{ flex: 1 }}>
        <div style={{ height: '13px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', marginBottom: '8px', width: '70%', animation: 'pulse 1.5s ease-in-out infinite' }}/>
        <div style={{ height: '11px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', width: '40%', animation: 'pulse 1.5s ease-in-out infinite 0.2s' }}/>
      </div>
    </div>
  )
}
/* ─── Activity Data ──────────────────────────────────────────────────── */
const ACTIVITY = [
  { id: 1, icon: '🎉', text: 'Your lost "Student ID Card" report matched with a found item!', time: '2 hours ago', color: '#10B981', type: 'match' },
  { id: 2, icon: '📦', text: 'You submitted a found report for "Blue Water Bottle" near Canteen.', time: '5 hours ago', color: '#4F46E5', type: 'report' },
  { id: 3, icon: '✅', text: '"Laptop Charger" has been marked as resolved by both parties.', time: '1 day ago', color: '#10B981', type: 'resolved' },
  { id: 4, icon: '💬', text: 'New message from Priya S. regarding your ID card match.', time: '1 day ago', color: '#F59E0B', type: 'chat' },
  { id: 5, icon: '🔑', text: 'You filed a lost report for "Keys (NIT Hostel)".', time: '3 days ago', color: '#7C3AED', type: 'report' },
  { id: 6, icon: '🤖', text: 'AI engine found a 78% match for your "Wallet" report.', time: '4 days ago', color: '#06B6D4', type: 'match' },
]
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
  const [loaded, setLoaded] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1400)
    return () => clearTimeout(t)
  }, [])
  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr  = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const firstName = user?.name?.split(' ')[0] || 'Student'
  const STATS = [
    {
      label: 'Active Reports', target: 3, suffix: '',
      colorFrom: '#4F46E5', colorTo: '#6366F1', glowColor: 'rgba(79,70,229,0.2)',
      icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    },
    {
      label: 'Matches Found', target: 1, suffix: '',
      colorFrom: '#10B981', colorTo: '#34D399', glowColor: 'rgba(16,185,129,0.2)',
      icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
    },
    {
      label: 'Items Resolved', target: 2, suffix: '',
      colorFrom: '#7C3AED', colorTo: '#8B5CF6', glowColor: 'rgba(124,58,237,0.2)',
      icon: <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    },
    {
      label: 'Days Active', target: 14, suffix: '',
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
              {ACTIVITY.length} events
            </span>
          </div>
          <div style={{ marginTop: '8px' }}>
            {loaded
              ? ACTIVITY.map((item, i) => <ActivityItem key={item.id} item={item} index={i} />)
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
