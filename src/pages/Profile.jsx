import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import { userAPI } from '../api/endpoints.js'

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
  const { logout } = useAuth()
  const [userData, setUserData] = useState(null)
  const [stats, setStats] = useState({
    totalReports: 0,
    resolvedReports: 0,
    matchRate: '0%'
  })
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await userAPI.getProfile()
        if (res.success) {
          setUserData(res.user)
          setStats(res.stats)
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(userData?.email || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const initials = userData?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

  const STAT_ITEMS = [
    { label: 'Reports Filed', value: stats.totalReports, colorFrom: '#4F46E5', colorTo: '#6366F1' },
    { label: 'Items Recovered', value: stats.resolvedReports, colorFrom: '#10B981', colorTo: '#34D399' },
    { label: 'Success Rate', value: stats.matchRate, colorFrom: '#F59E0B', colorTo: '#FBBF24' },
  ]

  if (loading) {
    return <DashboardLayout><div style={{ padding:'40px', color:'var(--color-text-muted)' }}>Updating profile details...</div></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
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
                {userData?.name || 'Student'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '3px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                  background: userData?.role === 'admin' ? 'rgba(244,63,94,0.12)' : 'rgba(16,185,129,0.12)',
                  color: userData?.role === 'admin' ? '#F43F5E' : '#10B981',
                  border: `1px solid ${userData?.role === 'admin' ? 'rgba(244,63,94,0.3)' : 'rgba(16,185,129,0.3)'}`,
                  textTransform: 'capitalize',
                }}>
                  {userData?.role === 'admin' ? '⚡' : '🎓'} {userData?.role || 'student'}
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
            <InfoRow label="Email Address" value={userData?.email || '—'} icon="📧" />
            <InfoRow label="Roll Number" value={userData?.roll || '—'} icon="🎓" />
            <InfoRow label="Institution" value="NIT Warangal" icon="🏛️" />
            <InfoRow label="Account Role" value={userData?.role === 'admin' ? 'Administrator' : 'Student'} icon="🛡️" />
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

        {/* Security Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          style={{
            background: 'var(--color-card)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: '24px', padding: '28px',
            marginTop: '20px',
          }}
        >
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'18px' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'rgba(16,185,129,0.12)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 style={{ fontSize:'14px', fontWeight:700, color:'var(--color-text-primary)' }}>Security Status</h3>
            <span style={{ marginLeft:'auto', fontSize:'11px', fontWeight:700, padding:'2px 10px', borderRadius:'20px', background:'rgba(16,185,129,0.12)', color:'#10B981', border:'1px solid rgba(16,185,129,0.25)' }}>● Secure</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {[
              { icon:'🔒', label:'NITW Domain Lock', desc:'Only @student.nitw.ac.in emails allowed' },
              { icon:'🔑', label:'JWT Authentication', desc:'Token-based session, expires every 7 days' },
              { icon:'🛡️', label:'Password Hashing', desc:'bcrypt with salt rounds (cost factor 10)' },
              { icon:'💬', label:'Encrypted Chat', desc:'Messages accessible only to matched participants' },
            ].map(item => (
              <div key={item.label} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'12px 14px', borderRadius:'12px', background:'rgba(255,255,255,0.02)', border:'1px solid var(--color-card-border)' }}>
                <span style={{ fontSize:'18px' }}>{item.icon}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:'13px', fontWeight:600, color:'var(--color-text-primary)', marginBottom:'1px' }}>{item.label}</p>
                  <p style={{ fontSize:'11px', color:'var(--color-text-muted)' }}>{item.desc}</p>
                </div>
                <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M20 6L9 17l-5-5" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          style={{ marginTop: '20px' }}
        >
          <button 
            onClick={logout}
            style={{
              width: '100%', padding: '16px', borderRadius: '16px',
              background: 'transparent', border: '1px solid rgba(244,63,94,0.3)',
              color: '#F43F5E', fontSize: '15px', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Sign Out of Account
          </button>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
