import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
/* ─── Typewriter ─────────────────────────────────────────────────────── */
const WORDS = ['your wallet', 'your ID card', 'your laptop bag', 'your keys']
function Typewriter() {
  const [wordIdx,    setWordIdx]    = useState(0)
  const [charIdx,    setCharIdx]    = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  useEffect(() => {
    const word  = WORDS[wordIdx]
    const delay = isDeleting
      ? 55
      : charIdx === word.length
        ? 1600   // pause at full word
        : 85
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (charIdx < word.length) {
          setCharIdx(c => c + 1)
        } else {
          setIsDeleting(true)
        }
      } else {
        if (charIdx > 0) {
          setCharIdx(c => c - 1)
        } else {
          setIsDeleting(false)
          setWordIdx(w => (w + 1) % WORDS.length)
        }
      }
    }, delay)
    return () => clearTimeout(timer)
  }, [wordIdx, charIdx, isDeleting])
  return (
    <span style={{ color: '#10B981', display: 'inline-block', minWidth: '2ch' }}>
      {WORDS[wordIdx].substring(0, charIdx)}
      <span className="cursor-blink" style={{ color: '#10B981', marginLeft: '1px' }}>|</span>
    </span>
  )
}
/* ─── Floating Match Card ────────────────────────────────────────────── */
function FloatingCard() {
  return (
    <div style={{ position: 'relative', width: '320px' }}>
      {/* Ambient glow behind card */}
      <div style={{
        position: 'absolute', inset: '-10px',
        background: 'linear-gradient(135deg, rgba(79,70,229,0.35), rgba(16,185,129,0.25))',
        borderRadius: '32px', filter: 'blur(28px)',
        transform: 'scale(0.92) translateY(8%)',
        zIndex: 0,
      }} />
      {/* Main Card */}
      <motion.div
        animate={{ y: [0, -18, 0], rotate: [0, 1, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'relative', zIndex: 1,
          background: 'rgba(22, 22, 42, 0.88)',
          border: '1px solid rgba(255,255,255,0.11)',
          borderRadius: '28px',
          padding: '24px',
          boxShadow: '0 30px 70px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg viewBox="0 0 24 24" fill="none" width="17" height="17">
                <path d="M16 6V5a3 3 0 00-3-3h-2a3 3 0 00-3 3v1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <rect x="2" y="6" width="20" height="15" rx="3" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#F1F5F9' }}>BackToOwner</span>
          </div>
          {/* Matched Badge */}
          <span style={{
            padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
            background: 'rgba(16,185,129,0.15)', color: '#10B981',
            border: '1px solid rgba(16,185,129,0.3)',
          }}>
            ✓ Matched!
          </span>
        </div>
        {/* Match Item Block */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          padding: '16px', borderRadius: '18px', marginBottom: '14px',
          background: 'rgba(16,185,129,0.07)',
          border: '1px solid rgba(16,185,129,0.18)',
        }}>
          <div style={{
            width: '46px', height: '46px', borderRadius: '13px', flexShrink: 0,
            background: 'rgba(16,185,129,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* ID Card SVG */}
            <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
              <rect x="2" y="5" width="20" height="14" rx="2.5" stroke="#10B981" strokeWidth="1.8"/>
              <circle cx="8" cy="12" r="2" stroke="#10B981" strokeWidth="1.5"/>
              <path d="M13 10h5M13 13h4" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: '#64748B', marginBottom: '2px', fontWeight: 500 }}>Found Item</p>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#F1F5F9', marginBottom: '4px' }}>Student ID Card</p>
            <p style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>
              🤖 AI Confidence: 97% match
            </p>
          </div>
        </div>
        {/* Location + Time */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: '7px',
            padding: '10px 12px', borderRadius: '12px',
            background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.2)',
          }}>
            <svg viewBox="0 0 24 24" fill="none" width="13" height="13">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" fill="#818CF8"/>
            </svg>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#94A3B8' }}>ECE Department</span>
          </div>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: '7px',
            padding: '10px 12px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <svg viewBox="0 0 24 24" fill="none" width="13" height="13">
              <circle cx="12" cy="12" r="10" stroke="#64748B" strokeWidth="1.8"/>
              <path d="M12 6v6l4 2" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#94A3B8' }}>2h ago</span>
          </div>
        </div>
        {/* Claim Button */}
        <motion.button
          id="card-claim-btn"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%', padding: '13px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: '#fff', fontSize: '14px', fontWeight: 700,
            border: 'none', cursor: 'pointer', letterSpacing: '-0.01em',
            boxShadow: '0 4px 20px rgba(16,185,129,0.35)',
          }}
        >
          Claim My Item →
        </motion.button>
        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: '16px', paddingTop: '14px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex' }}>
            {['#4F46E5', '#10B981', '#F43F5E', '#F59E0B'].map((c, i) => (
              <div key={i} style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: c, border: '2px solid rgba(22,22,42,0.9)',
                marginLeft: i > 0 ? '-7px' : 0,
              }} />
            ))}
          </div>
          <span style={{ fontSize: '11px', color: '#475569' }}>Be the first to return something 🎯</span>
        </div>
      </motion.div>
      {/* Floating Badge – top right */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.6, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-14px', right: '-18px', zIndex: 2,
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '8px 13px', borderRadius: '14px',
          background: 'rgba(22,22,42,0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{
          width: '20px', height: '20px', borderRadius: '50%',
          background: 'rgba(16,185,129,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg viewBox="0 0 24 24" fill="none" width="11" height="11">
            <path d="M20 6L9 17l-5-5" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#F1F5F9', whiteSpace: 'nowrap' }}>Item Returned!</span>
      </motion.div>
      {/* Floating Badge – bottom left */}
      <motion.div
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, delay: 1.1, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: '-16px', left: '-22px', zIndex: 2,
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '8px 13px', borderRadius: '14px',
          background: 'rgba(22,22,42,0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
        <span style={{ fontSize: '12px', fontWeight: 500, color: '#94A3B8', whiteSpace: 'nowrap' }}>AI Matching Active</span>
      </motion.div>
    </div>
  )
}
/* ─── Animation Variants ─────────────────────────────────────────────── */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
}
/* ─── Hero ───────────────────────────────────────────────────────────── */
export default function Hero() {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const handleLostClick = () => {
    if (isLoggedIn) navigate('/report-lost')
    else navigate('/login', { state: { from: '/report-lost' } })
  }
  const handleFoundClick = () => {
    if (isLoggedIn) navigate('/report-found')
    else navigate('/login', { state: { from: '/report-found' } })
  }
  return (
    <section
      id="home"
      className="mesh-gradient"
      style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        paddingTop: 'var(--navbar-height)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Background Orbs */}
      <div style={{
        position: 'absolute', top: '20%', left: '5%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'rgba(79,70,229,0.09)', filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '10%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'rgba(16,185,129,0.07)', filter: 'blur(70px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'rgba(139,92,246,0.06)', filter: 'blur(60px)',
        transform: 'translate(-50%, -50%)', pointerEvents: 'none',
      }} />
      {/* Grid Layout */}
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '80px 24px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '64px',
        alignItems: 'center',
      }}>
        {/* ── Left: Text Content ──────────────────────────────────── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          {/* Pill Badge */}
          <motion.div variants={fadeUp} style={{ marginBottom: '24px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '99px',
              background: 'rgba(79,70,229,0.12)',
              border: '1px solid rgba(79,70,229,0.32)',
              color: '#818CF8', fontSize: '12px', fontWeight: 600,
              letterSpacing: '0.02em',
            }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 6px #10B981',
                animation: 'pulse 2s infinite',
              }} />
              AI-Powered · NIT Warangal Exclusive
            </span>
          </motion.div>
          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            style={{
              fontSize: 'clamp(38px, 5vw, 62px)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.08,
              color: 'var(--color-text-primary)',
              marginBottom: '16px',
            }}
          >
            Lost something<br />
            on campus?
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #4F46E5, #818CF8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              We'll find it.
            </span>
          </motion.h1>
          {/* Typewriter */}
          <motion.div
            variants={fadeUp}
            style={{
              fontSize: 'clamp(22px, 3vw, 34px)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              marginBottom: '24px',
              minHeight: '44px',
              color: 'var(--color-text-primary)',
            }}
          >
            Find&nbsp;
            <Typewriter />
          </motion.div>
          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            style={{
              fontSize: '17px', lineHeight: 1.75,
              color: 'var(--color-text-secondary)',
              maxWidth: '460px',
              marginBottom: '40px',
            }}
          >
            AI-powered matching for NIT Warangal students. Report lost items,
            connect with finders, and get your belongings back — fast. {' '}
            <span 
              onClick={() => navigate('/about')}
              style={{ color: '#4F46E5', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '4px' }}
            >
              Learn more about how it works →
            </span>
          </motion.p>
          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}
          >
            {/* Primary CTA */}
            <motion.button
              id="report-lost-item-btn"
              onClick={handleLostClick}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '9px',
                padding: '14px 30px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                color: '#fff', fontSize: '15px', fontWeight: 700,
                letterSpacing: '-0.01em', border: 'none', cursor: 'pointer',
                animation: 'pulse-glow 2.5s ease-in-out infinite',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35M11 8v3m0 0v3m0-3H8m3 0h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Report Lost Item
            </motion.button>
            {/* Outline CTA */}
            <motion.button
              id="found-something-btn"
              onClick={handleFoundClick}
              whileHover={{ scale: 1.05, y: -2, borderColor: '#10B981', color: '#10B981' }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '9px',
                padding: '14px 30px', borderRadius: '16px',
                background: 'rgba(16,185,129,0.06)',
                border: '1.5px solid rgba(16,185,129,0.35)',
                color: 'var(--color-text-primary)',
                fontSize: '15px', fontWeight: 700,
                letterSpacing: '-0.01em', cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <path d="M9 12l2 2 4-4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 19h6M19 16v6" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              I Found Something
            </motion.button>
          </motion.div>
          {/* Stats Row */}
          <motion.div
            variants={fadeUp}
            style={{
              display: 'flex', flexWrap: 'wrap', gap: '32px',
              marginTop: '48px', paddingTop: '32px',
              borderTop: '1px solid var(--color-card-border)',
            }}
          >
            {[
              { value: 'NITW',    label: 'Exclusive Campus' },
              { value: 'AI',      label: 'Smart Matching' },
              { value: '🔒',     label: 'Privacy First' },
            ].map(stat => (
              <div key={stat.label}>
                <p style={{
                  fontSize: '26px', fontWeight: 800, letterSpacing: '-0.04em',
                  background: 'linear-gradient(135deg, #4F46E5, #818CF8)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
        {/* ── Right: Floating Card ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 0',
          }}
        >
          <FloatingCard />
        </motion.div>
      </div>
    </section>
  )
}
