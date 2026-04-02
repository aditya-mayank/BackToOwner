import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
/* ─── Stat Data ──────────────────────────────────────────────────────── */
const STATS = [
  {
    id: 'ai-matching',
    target: 70,
    suffix: '%+',
    label: 'Match Threshold',
    sublabel: 'AI triggers a match at 70%+ similarity',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
        <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    colorFrom: '#4F46E5',
    colorTo:   '#818CF8',
    glowColor: 'rgba(79,70,229,0.3)',
  },
  {
    id: 'campus-locations',
    target: 80,
    suffix: '+',
    label: 'Campus Locations',
    sublabel: 'Every corner of NITW campus covered',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" fill="currentColor" opacity="0.2"/>
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
    colorFrom: '#10B981',
    colorTo:   '#34D399',
    glowColor: 'rgba(16,185,129,0.3)',
  },
  {
    id: 'privacy-first',
    target: 100,
    suffix: '%',
    label: 'Privacy Protected',
    sublabel: 'No contact info shared until match confirmed',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
        <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
      </svg>
    ),
    colorFrom: '#F43F5E',
    colorTo:   '#FB7185',
    glowColor: 'rgba(244,63,94,0.3)',
  },
]
/* ─── Animated Counter Hook ──────────────────────────────────────────── */
function useCountUp(target, isInView, duration = 1800) {
  const [count, setCount] = useState(0)
  const rafRef = useRef(null)
  useEffect(() => {
    if (!isInView) return
    let start = null
    const step = (timestamp) => {
      if (!start) start = timestamp
      const elapsed  = timestamp - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isInView, target, duration])
  return count
}
/* ─── Single Stat ────────────────────────────────────────────────────── */
function StatItem({ stat, index, isInView }) {
  const count = useCountUp(stat.target, isInView, 1600 + index * 200)
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.65, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      style={{
        flex: 1,
        minWidth: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '36px 24px',
        position: 'relative',
      }}
    >
      {/* Divider (not on first) */}
      {index > 0 && (
        <div style={{
          position: 'absolute', left: 0, top: '20%', bottom: '20%', width: '1px',
          background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.08), transparent)',
        }} />
      )}
      {/* Icon */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
        style={{
          width: '60px', height: '60px', borderRadius: '18px',
          background: `linear-gradient(135deg, ${stat.colorFrom}, ${stat.colorTo})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', marginBottom: '20px',
          boxShadow: `0 8px 28px ${stat.glowColor}`,
        }}
      >
        {stat.icon}
      </motion.div>
      {/* Counter */}
      <div style={{
        fontSize: 'clamp(40px, 5vw, 58px)',
        fontWeight: 800,
        letterSpacing: '-0.04em',
        lineHeight: 1,
        marginBottom: '8px',
        background: `linear-gradient(135deg, ${stat.colorFrom}, ${stat.colorTo})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        {count}{stat.suffix}
      </div>
      {/* Label */}
      <p style={{
        fontSize: '17px', fontWeight: 700, letterSpacing: '-0.015em',
        color: 'var(--color-text-primary)', marginBottom: '6px',
      }}>
        {stat.label}
      </p>
      {/* Sublabel */}
      <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 400 }}>
        {stat.sublabel}
      </p>
    </motion.div>
  )
}
/* ─── Main Section ───────────────────────────────────────────────────── */
export default function StatsBar() {
  const sectionRef = useRef(null)
  const isInView   = useInView(sectionRef, { once: true, margin: '-60px' })
  return (
    <section
      id="stats"
      ref={sectionRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '0',
        background: 'var(--color-bg-secondary)',
      }}
    >
      {/* Dot-grid pattern overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle, rgba(79,70,229,0.18) 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
        pointerEvents: 'none',
      }} />
      {/* Top gradient fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '80px',
        background: 'linear-gradient(to bottom, var(--color-bg), transparent)',
        pointerEvents: 'none', zIndex: 1,
      }} />
      {/* Bottom gradient fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
        background: 'linear-gradient(to top, var(--color-bg), transparent)',
        pointerEvents: 'none', zIndex: 1,
      }} />
      {/* Ambient glows */}
      <div style={{
        position: 'absolute', top: '50%', left: '20%', transform: 'translate(-50%,-50%)',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'rgba(79,70,229,0.06)', filter: 'blur(80px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '50%', right: '10%', transform: 'translateY(-50%)',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'rgba(16,185,129,0.05)', filter: 'blur(70px)', pointerEvents: 'none',
      }} />
      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: '1100px', margin: '0 auto', padding: '0 24px',
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', paddingTop: '72px', marginBottom: '8px' }}
        >
          <span style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
            color: 'var(--color-text-muted)', textTransform: 'uppercase',
          }}>
            By the numbers
          </span>
        </motion.div>
        {/* Stats Row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'stretch',
          paddingBottom: '72px',
        }}>
          {STATS.map((stat, i) => (
            <StatItem key={stat.id} stat={stat} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}
