import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'

const STAT_ITEMS = [
  { label: 'Reports Filed', value: '5', colorFrom: '#4F46E5', colorTo: '#6366F1', glow: 'rgba(79,70,229,0.25)' },
  { label: 'Items Recovered', value: '2', colorFrom: '#10B981', colorTo: '#34D399', glow: 'rgba(16,185,129,0.25)' },
  { label: 'Match Rate', value: '80%', colorFrom: '#F59E0B', colorTo: '#FBBF24', glow: 'rgba(245,158,11,0.25)' },
]

const BADGE_ITEMS = [
  { label: 'Early Adopter', icon: '🚀', color: '#4F46E5' },
  { label: 'Good Samaritan', icon: '🤝', color: '#10B981' },
  { label: 'AI Believer', icon: '🤖', color: '#7C3AED' },
]

function InfoRow({ label, value, icon }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '16px 18px', borderRadius: '14px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--color-card-border)',
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(79,70,229,0.3)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-card-border)'}
    >
      <span style={{ fontSize: '18px', flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '3px' }}>{label}</p>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{value}</p>
      </div>
    </div>
  )
}

export default function Profile() {
  const { user, logout } = useAuth()
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(user?.email || 'student@nitw.ac.in')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '720px' }}>
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '28px' }}
        >
          <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Account</p>
          <h1 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-text-primary)' }}>My Profile</h1>
        </motion.div>

        {/* Avatar + Name card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-card-border)',
            borderRadius: '24px',
            padding: '32px',
            marginBottom: '20px',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Background blob */}
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(79,70,229,0.07)', filter: 'blur(40px)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.06, rotate: 2 }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{
                width: '88px', height: '88px', borderRadius: '26px', flexShrink: 0,
                background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '30px', fontWeight: 900, color: '#fff',
                boxShadow: '0 10px 36px rgba(79,70,229,0.45)',
                letterSpacing: '-0.02em',
              }}
            >
              {initials}
            </motion.div>

            {/* Name & role */}
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                {user?.name || 'Student'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '3px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                  background: user?.role === 'admin' ? 'rgba(244,63,94,0.12)' : 'rgba(16,185,129,0.12)',
                  color: user?.role === 'admin' ? '#F43F5E' : '#10B981',
                  border: `1px solid ${user?.role === 'admin' ? 'rgba(244,63,94,0.3)' : 'rgba(16,185,129,0.3)'}`,
                  textTransform: 'capitalize',
                }}>
                  {user?.role === 'admin' ? '⚡' : '🎓'} {user?.role || 'student'}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 500 }}>NIT Warangal</span>
              </div>
            </div>

            {/* Copy email button */}
            <motion.button
              id="copy-email-btn"
              onClick={handleCopyEmail}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '9px 16px', borderRadius: '10px', cursor: 'pointer',
                background: copied ? 'rgba(16,185,129,0.12)' : 'var(--glass-bg)',
                border: `1px solid ${copied ? 'rgba(16,185,129,0.35)' : 'var(--glass-border)'}`,
                color: copied ? '#10B981' : 'var(--color-text-secondary)',
                fontSize: '13px', fontWeight: 600, transition: 'all 0.25s',
              }}
            >
              {copied ? (
                <><svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg> Copied!</>
              ) : (
                <><svg viewBox="0 0 24 24" fill="none" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/></svg> Copy Email</>
              )}
            </motion.button>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
            {STAT_ITEMS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                style={{
                  flex: '1 1 120px', padding: '16px 18px', borderRadius: '14px',
                  background: `linear-gradient(135deg, ${s.colorFrom}18, ${s.colorTo}10)`,
                  border: `1px solid ${s.colorFrom}30`,
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.04em', background: `linear-gradient(135deg, ${s.colorFrom}, ${s.colorTo})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '4px' }}>{s.value}</p>
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Info details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-card-border)',
            borderRadius: '24px', padding: '28px',
            marginBottom: '20px',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--color-text-primary)', marginBottom: '16px' }}>Account Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <InfoRow label="Email Address" value={user?.email || 'student@nitw.ac.in'} icon="📧" />
            <InfoRow label="Roll Number" value={user?.roll || '22CSB0001'} icon="🎓" />
            <InfoRow label="Institution" value="NIT Warangal" icon="🏛️" />
            <InfoRow label="Account Role" value={user?.role === 'admin' ? 'Administrator' : 'Student'} icon="🛡️" />
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-card-border)',
            borderRadius: '24px', padding: '28px',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '16px' }}>🏅 Badges Earned</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {BADGE_ITEMS.map(b => (
              <motion.div
                key={b.label}
                whileHover={{ scale: 1.07, y: -2 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 16px', borderRadius: '12px',
                  background: `${b.color}14`, border: `1px solid ${b.color}30`,
                  cursor: 'default',
                }}
              >
                <span style={{ fontSize: '16px' }}>{b.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: b.color }}>{b.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
