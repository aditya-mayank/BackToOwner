import React, { useState } from 'react'
import { useNavigate, Link, NavLink, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
/* ─── Mock user ──────────────────────────────────────────────────────── */
const USER = { name: 'Arjun Reddy', roll: '22CSB0001', dept: 'CSE · 2022', initials: 'AR' }
const SIDEBAR_W = 248
/* ─── Nav items ──────────────────────────────────────────────────────── */
const NAV = [
  {
    id: 'dashboard', label: 'Dashboard', href: '/dashboard',
    icon: <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/></svg>,
  },
  {
    id: 'report-lost', label: 'Report Lost', href: '/report-lost',
    icon: <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><path d="m21 21-4.35-4.35M11 8v3m0 0v3m0-3H8m3 0h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  },
  {
    id: 'report-found', label: 'Report Found', href: '/report-found',
    icon: <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h7" stroke="currentColor" strokeWidth="2"/><path d="M16 19h6M19 16v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  },
  {
    id: 'my-reports', label: 'My Reports', href: '/my-reports',
    icon: <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  },
  {
    id: 'notifications', label: 'Notifications', href: '/notifications', badge: 3,
    icon: <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  },
  {
    id: 'chat', label: 'Chat', href: '/chat/123', badge: 1,
    icon: <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
  },
  {
    id: 'profile', label: 'Profile', href: '/profile',
    icon: <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  },
]
/* ─── Nav Item ───────────────────────────────────────────────────────── */
function NavItem({ item, collapsed, onClick }) {
  return (
    <NavLink
      to={item.href}
      onClick={onClick}
      id={`sidebar-nav-${item.id}`}
      style={({ isActive }) => ({
        display: 'flex', alignItems: 'center',
        gap: collapsed ? 0 : '11px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        padding: collapsed ? '12px' : '11px 16px',
        borderRadius: '12px',
        margin: '2px 0',
        textDecoration: 'none',
        position: 'relative', overflow: 'hidden',
        color: isActive ? '#818CF8' : 'var(--color-text-secondary)',
        background: isActive ? 'rgba(79,70,229,0.12)' : 'transparent',
        borderLeft: !collapsed ? `3px solid ${isActive ? '#4F46E5' : 'transparent'}` : 'none',
        boxShadow: isActive && !collapsed ? 'inset 4px 0 16px rgba(79,70,229,0.1)' : 'none',
        transition: 'all 0.2s ease',
        fontWeight: isActive ? 600 : 400,
        fontSize: '14px',
        whiteSpace: 'nowrap',
      })}
      onMouseEnter={e => {
        if (!e.currentTarget.dataset.active) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
          e.currentTarget.style.color = 'var(--color-text-primary)'
        }
      }}
      onMouseLeave={e => {
        // NavLink re-applies its styles
      }}
      title={collapsed ? item.label : undefined}
    >
      {({ isActive }) => (
        <>
          <span style={{ flexShrink: 0, color: isActive ? '#818CF8' : 'var(--color-text-secondary)' }}>
            {item.icon}
          </span>
          {!collapsed && (
            <span style={{ flex: 1, letterSpacing: '-0.01em' }}>{item.label}</span>
          )}
          {!collapsed && item.badge && (
            <span style={{
              fontSize: '10px', fontWeight: 700, minWidth: '18px', height: '18px',
              borderRadius: '9px', background: '#F43F5E', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px',
            }}>
              {item.badge}
            </span>
          )}
          {collapsed && item.badge && (
            <span style={{
              position: 'absolute', top: '6px', right: '6px',
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#F43F5E',
            }}/>
          )}
        </>
      )}
    </NavLink>
  )
}
/* ─── Sidebar Content ────────────────────────────────────────────────── */
function SidebarContent({ collapsed, setCollapsed, onClose }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      background: 'var(--color-card)',
      borderRight: '1px solid var(--color-card-border)',
      padding: '20px 12px',
      position: 'relative',
    }}>
      {/* Logo row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', marginBottom: '28px', padding: '0 4px' }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg,#4F46E5,#6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(79,70,229,0.4)' }}>
              <svg viewBox="0 0 24 24" fill="none" width="15" height="15"><path d="M16 6V5a3 3 0 00-3-3h-2a3 3 0 00-3 3v1" stroke="white" strokeWidth="2" strokeLinecap="round"/><rect x="2" y="6" width="20" height="15" rx="3" stroke="white" strokeWidth="2" fill="none"/></svg>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
              Back<span style={{ color: '#4F46E5' }}>To</span>Owner
            </span>
          </div>
        )}
        {/* Collapse toggle (desktop only) */}
        <motion.button
          id="sidebar-collapse-btn"
          onClick={() => setCollapsed?.(v => !v)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="hidden lg:flex"
          style={{
            width: '26px', height: '26px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--color-card-border)',
            color: 'var(--color-text-muted)',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" width="13" height="13">
            {collapsed
              ? <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              : <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            }
          </svg>
        </motion.button>
        {/* Mobile close */}
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}>
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        )}
      </div>
      {/* User Card */}
      <div style={{
        display: 'flex', flexDirection: collapsed ? 'column' : 'row',
        alignItems: 'center', gap: '10px',
        padding: collapsed ? '10px 0' : '12px',
        borderRadius: '14px',
        background: 'rgba(79,70,229,0.07)',
        border: '1px solid rgba(79,70,229,0.15)',
        marginBottom: '20px',
      }}>
        {/* Avatar */}
        <div style={{
          width: '38px', height: '38px', borderRadius: '12px', flexShrink: 0,
          background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', fontWeight: 800, color: '#fff',
          boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
        }}>
          {user?.name?.charAt(0) || 'U'}
        </div>
        {!collapsed && (
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.01em', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.name || 'Student'}</p>
            <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '1px', textTransform:'capitalize' }}>{user?.role || 'Student'}</p>
          </div>
        )}
      </div>
      {/* Nav Label */}
      {!collapsed && (
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--color-text-muted)', textTransform: 'uppercase', padding: '0 4px', marginBottom: '8px' }}>
          Navigation
        </p>
      )}
      {/* Nav Links */}
      <nav style={{ flex: 1 }}>
        {NAV.map(item => (
          <NavItem key={item.id} item={item} collapsed={collapsed} onClick={onClose} />
        ))}
        {user?.role === 'admin' && (
          <NavItem 
            key="admin" 
            item={{
              id: 'admin', label: 'Admin Portal', href: '/admin',
              icon: <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M12 11V8M12 11c0 1.657-1.343 3-3 3s-3-1.343-3-3m6 0c0 1.657 1.343 3 3 3s3-1.343 3-3M3 17a5 5 0 0110 0v4H3v-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            }} 
            collapsed={collapsed} onClick={onClose} 
          />
        )}
      </nav>
      {/* Logout */}
      <div style={{ borderTop: '1px solid var(--color-card-border)', paddingTop: '12px', marginTop: '8px' }}>
        <motion.button
          id="sidebar-logout-btn"
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%', padding: collapsed ? '12px' : '11px 16px',
            display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '11px', borderRadius: '12px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#F43F5E', fontSize: '14px', fontWeight: 500,
            transition: 'background .2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          title={collapsed ? 'Logout' : undefined}
        >
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {!collapsed && <span>Logout</span>}
        </motion.button>
      </div>
    </div>
  )
}
/* ─── Dashboard Layout ───────────────────────────────────────────────── */
export default function DashboardLayout({ children }) {
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [collapsed,   setCollapsed]   = useState(false)
  const { user } = useAuth()
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* ── Desktop Sidebar ─────────────────────────────────────────── */}
      <motion.div
        animate={{ width: collapsed ? 68 : SIDEBAR_W }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:block"
        style={{ flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}
      >
        <SidebarContent collapsed={collapsed} setCollapsed={setCollapsed} />
      </motion.div>
      {/* ── Mobile Overlay ──────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150, backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              key="drawer"
              initial={{ x: -SIDEBAR_W }} animate={{ x: 0 }} exit={{ x: -SIDEBAR_W }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: SIDEBAR_W, zIndex: 200 }}
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* ── Main Area ───────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Mobile Top Bar */}
        <div className="flex lg:hidden" style={{
          height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px',
          background: 'var(--color-card)',
          borderBottom: '1px solid var(--color-card-border)',
          flexShrink: 0,
        }}>
          <button
            id="mobile-sidebar-toggle"
            onClick={() => setMobileOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', display: 'flex' }}
          >
            <svg viewBox="0 0 24 24" fill="none" width="22" height="22"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Back<span style={{ color: '#4F46E5' }}>To</span>Owner
          </span>
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg,#4F46E5,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#fff' }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
        {/* Scrollable Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px 32px 48px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
