import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Sun, Moon, Menu, X } from 'lucide-react'
const NAV_LINKS = [
  { label: 'Home',         href: '#home' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About',        href: '#about' },
]
export default function Navbar({ isDark, toggleDark }) {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <>
      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <motion.nav
        id="navbar"
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position:        'fixed',
          top:             0,
          left:            0,
          right:           0,
          zIndex:          100,
          height:          'var(--navbar-height)',
          background:      scrolled ? 'var(--glass-bg)'    : 'transparent',
          backdropFilter:  scrolled ? 'var(--glass-blur)'  : 'none',
          WebkitBackdropFilter: scrolled ? 'var(--glass-blur)' : 'none',
          borderBottom:    scrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
          transition:      'background 0.35s ease, border-color 0.35s ease',
        }}
      >
        <div
          style={{
            maxWidth:      '1280px',
            margin:        '0 auto',
            padding:       '0 24px',
            height:        '100%',
            display:       'flex',
            alignItems:    'center',
            justifyContent:'space-between',
          }}
        >
          {/* Logo */}
          <motion.a
            href="#home"
            id="navbar-logo"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 400 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
          >
            {/* Backpack Icon */}
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
              background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(79,70,229,0.5)',
            }}>
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                <path d="M16 6V5a3 3 0 00-3-3h-2a3 3 0 00-3 3v1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="2" y="6" width="20" height="15" rx="3" stroke="white" strokeWidth="2" fill="none"/>
                <path d="M8 11h8M12 11v5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{
              fontSize: '18px', fontWeight: 700, letterSpacing: '-0.025em',
              color: 'var(--color-text-primary)',
            }}>
              Back<span style={{ color: '#4F46E5' }}>To</span>Owner
            </span>
          </motion.a>
          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }} className="desktop-only">
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.4, ease: 'easeOut' }}
                whileHover={{ color: '#4F46E5' }}
                style={{
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--color-text-secondary)',
                  transition: 'color 0.2s',
                }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>
          {/* Right Controls */}
            {/* Theme Toggle & CTA area */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <motion.button
                id="theme-toggle-btn"
                aria-label="Toggle dark/light mode"
                onClick={toggleDark}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isDark ? 'sun' : 'moon'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0,   opacity: 1 }}
                    exit={{   rotate:  90, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    style={{ display: 'flex' }}
                  >
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
              {/* Desktop Auth CTA */}
              <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {isLoggedIn ? (
                  <motion.button
                    onClick={() => navigate('/dashboard')}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      padding: '9px 20px', borderRadius: '10px',
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: '#fff', fontSize: '14px', fontWeight: 600,
                      border: 'none', cursor: 'pointer',
                      boxShadow: '0 0 22px rgba(16,185,129,0.3)',
                    }}
                  >
                    Go to Dashboard
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      onClick={() => navigate('/login')}
                      whileHover={{ color: '#4F46E5' }}
                      style={{
                        padding: '9px 16px', background: 'transparent',
                        color: 'var(--color-text-primary)', fontSize: '14px', fontWeight: 600,
                        border: 'none', cursor: 'pointer', transition: 'color 0.2s'
                      }}
                    >
                      Login
                    </motion.button>
                    <motion.button
                      id="login-college-id-btn"
                      onClick={() => navigate('/register')}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        padding: '9px 20px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                        color: '#fff', fontSize: '14px', fontWeight: 600,
                        border: 'none', cursor: 'pointer',
                        boxShadow: '0 0 22px rgba(79,70,229,0.45)',
                      }}
                    >
                      Register
                    </motion.button>
                  </>
                )}
              </div>
            {/* Hamburger — Mobile */}
            <motion.button
              id="mobile-menu-btn"
              className="mobile-only"
              aria-label="Toggle mobile menu"
              onClick={() => setMenuOpen(v => !v)}
              whileTap={{ scale: 0.9 }}
              style={{
                width: '38px', height: '38px', borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
              }}
            >
              {menuOpen ? <X size={17} /> : <Menu size={17} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>
      {/* ── Mobile Drawer ───────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-drawer"
            className="mobile-only"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{   opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            style={{
              position: 'fixed', top: 'var(--navbar-height)', left: 0, right: 0,
              zIndex: 99, overflow: 'hidden',
              background: 'var(--color-bg)',
              borderBottom: '1px solid var(--glass-border)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {NAV_LINKS.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontSize: '18px', fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    textDecoration: 'none',
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                  }}
                >
                  {link.label}
                </a>
              ))}
              {isLoggedIn ? (
                <button
                  onClick={() => { setMenuOpen(false); navigate('/dashboard'); }}
                  style={{
                    padding: '16px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: '#fff', fontSize: '16px', fontWeight: 700,
                    border: 'none', cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(16,185,129,0.3)',
                  }}
                >
                  Go to Dashboard
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/login'); }}
                    style={{
                      padding: '14px', borderRadius: '12px',
                      background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                      color: 'var(--color-text-primary)', fontSize: '15px', fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/register'); }}
                    style={{
                      padding: '14px', borderRadius: '12px',
                      background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
                      color: '#fff', fontSize: '15px', fontWeight: 600,
                      border: 'none', cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
                    }}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
