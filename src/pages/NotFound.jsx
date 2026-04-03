import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg)', color: 'var(--color-text-primary)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div style={{ position: 'absolute', top: '20%', left: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(79,70,229,0.08)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(16,185,129,0.07)', filter: 'blur(70px)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '40px 24px' }}
      >
        {/* Floating 404 */}
        <motion.div
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ marginBottom: '24px' }}
        >
          {/* Glowing number */}
          <div style={{
            fontSize: 'clamp(80px, 18vw, 140px)',
            fontWeight: 900,
            letterSpacing: '-0.05em',
            lineHeight: 1,
            background: 'linear-gradient(135deg, #4F46E5, #818CF8, #10B981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 48px rgba(79,70,229,0.5))',
          }}>
            404
          </div>
        </motion.div>

        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          style={{
            width: '68px', height: '68px', borderRadius: '22px', margin: '0 auto 28px',
            background: 'linear-gradient(135deg, rgba(79,70,229,0.15), rgba(16,185,129,0.1))',
            border: '1px solid rgba(79,70,229,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5',
          }}
        >
          <Search size={32} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-text-primary)', marginBottom: '12px' }}
        >
          Item Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ fontSize: '16px', color: 'var(--color-text-secondary)', maxWidth: '400px', margin: '0 auto 36px', lineHeight: 1.7 }}
        >
          Looks like this page got lost on campus. Let's help you find your way back.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link to="/" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '13px 28px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
                color: '#fff', fontSize: '15px', fontWeight: 700,
                boxShadow: '0 8px 32px rgba(79,70,229,0.45)',
                cursor: 'pointer',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Go Home
            </motion.div>
          </Link>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.05, y: -2, borderColor: '#4F46E5', color: '#818CF8' }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '13px 28px', borderRadius: '14px',
                background: 'transparent', border: '1.5px solid var(--color-card-border)',
                color: 'var(--color-text-secondary)', fontSize: '15px', fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              Dashboard →
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
