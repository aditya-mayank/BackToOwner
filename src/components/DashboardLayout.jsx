import React, { useState } from 'react'
import { useNavigate, NavLink, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { itemsAPI } from '../api/endpoints.js'

const SIDEBAR_W = 248

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
        </>
      )}
    </NavLink>
  )
}

/* ─── Sidebar Content ────────────────────────────────────────────────── */
function SidebarContent({ collapsed, setCollapsed, onClose }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [hasMatches, setHasMatches] = useState(false)
  const [isDark, setIsDark] = useState(() =>
    localStorage.getItem('backtoowner-theme') !== 'light'
  )

  React.useEffect(() => {
    if (!user) return;
    async function checkMatches() {
      try {
        const queryId = user._id || user.userId || user.id;
        const res = await itemsAPI.searchItems({ reportedBy: queryId });
        const items = res.results || res.data?.results || res.items || [];
        const matched = items.some(item => item.status === 'matched');
        setHasMatches(matched);
      } catch (err) {
        console.error('Check matches error:', err);
      }
    }
    checkMatches();
  }, [user]);

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const dynamicNav = [
    { id: 'home', label: 'Home', href: '/', icon: <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg> },
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/></svg> },
    { id: 'report-lost', label: 'Report Lost', href: '/report-lost', icon: <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><path d="m21 21-4.35-4.35M11 8v3m0 0v3m0-3H8m3 0h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
    { id: 'report-found', label: 'Report Found', href: '/report-found', icon: <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h7" stroke="currentColor" strokeWidth="2"/><path d="M16 19h6M19 16v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
    { id: 'my-reports', label: 'My Reports', href: '/my-reports', icon: <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
    { id: 'notifications', label: 'Notifications', href: '/notifications', icon: <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
    { id: 'chat', label: 'Matches & Chats', href: '/chats', icon: <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>, badge: hasMatches ? '!' : null },
    { id: 'profile', label: 'Profile', href: '/profile', icon: <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  ]

  const handleToggleTheme = () => {
    const root = document.documentElement;
    const newDark = !isDark;
    root.classList.toggle('dark',  newDark);
    root.classList.toggle('light', !newDark);
    localStorage.setItem('backtoowner-theme', newDark ? 'dark' : 'light');
    setIsDark(newDark);
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-card)', borderRight: '1px solid var(--color-card-border)', padding: '20px 12px' }}>
      {/* Sidebar header: logo + hamburger collapse toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', padding: '0 4px' }}>
        {!collapsed && (
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg,#4F46E5,#6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" width="15" height="15"><path d="M16 6V5a3 3 0 00-3-3h-2a3 3 0 00-3 3v1" stroke="white" strokeWidth="2"/><rect x="2" y="6" width="20" height="15" rx="3" stroke="white" strokeWidth="2" fill="none"/></svg>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>BackToOwner</span>
          </Link>
        )}
        {/* Hamburger — always shown, toggles collapse */}
        {setCollapsed && (
          <button
            onClick={() => setCollapsed(v => !v)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '4px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        )}
      </div>

      {/* User card — click to go to Profile + Logout right below */}
      <motion.div
        onClick={() => { navigate('/profile'); if (onClose) onClose(); }}
        whileHover={{ scale: 1.02 }}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: collapsed ? '10px 0' : '12px', borderRadius: '14px', background: 'rgba(79,70,229,0.07)', marginBottom: '6px', cursor: 'pointer', justifyContent: collapsed ? 'center' : 'flex-start' }}
        title="Go to Profile"
      >
        <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 800, flexShrink: 0 }}>
          {user?.name?.charAt(0) || 'U'}
        </div>
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize:'13px', fontWeight:700, color:'var(--color-text-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name || 'Student'}</p>
            <p style={{ fontSize:'11px', color:'var(--color-text-muted)', fontWeight:500 }}>View Profile →</p>
          </div>
        )}
      </motion.div>

      {/* Logout — always visible, no scrolling needed */}
      <motion.button
        onClick={handleLogout}
        whileHover={{ scale: 1.02 }}
        style={{ width: '100%', padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(244,63,94,0.2)', background: 'rgba(244,63,94,0.04)', color: '#F43F5E', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', justifyContent: collapsed ? 'center' : 'flex-start', marginBottom: '16px' }}
      >
        <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2"/></svg>
        {!collapsed && <span style={{ fontSize: '13px', fontWeight: 600 }}>Logout</span>}
      </motion.button>

      <nav style={{ flex: 1, overflowY: 'auto' }}>
        {dynamicNav.map(item => <NavItem key={item.id} item={item} collapsed={collapsed} onClick={onClose} />)}
        {user?.role === 'admin' && (
          <NavItem key="admin" item={{ id: 'admin', label: 'Admin Portal', href: '/admin', icon: <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M12 11V8M12 11c0 1.657-1.343 3-3 3s-3-1.343-3-3m6 0c0 1.657 1.343 3 3 3s3-1.343 3-3M3 17a5 5 0 0110 0v4H3v-4z" stroke="currentColor" strokeWidth="2"/></svg> }} collapsed={collapsed} onClick={onClose} />
        )}
      </nav>

      {/* Theme toggle — bottom, less frequently used */}
      <div style={{ borderTop: '1px solid var(--color-card-border)', paddingTop: '12px' }}>
        <motion.button onClick={handleToggleTheme} whileHover={{ scale: 1.02 }} style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--color-card-border)', background: 'transparent', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          {isDark
            ? <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" stroke="currentColor" strokeWidth="2"/></svg>
            : <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          }
          {!collapsed && <span style={{ fontSize: '14px', fontWeight: 500 }}>{isDark ? 'Switch to Light' : 'Switch to Dark'}</span>}
        </motion.button>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useAuth()
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div className="hidden lg:block" style={{ width: collapsed ? 68 : SIDEBAR_W, transition: 'width 0.3s' }}>
        <SidebarContent collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150 }} />
            <motion.div initial={{ x: -SIDEBAR_W }} animate={{ x: 0 }} exit={{ x: -SIDEBAR_W }} style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: SIDEBAR_W, zIndex: 200 }}><SidebarContent onClose={() => setMobileOpen(false)} /></motion.div>
          </>
        )}
      </AnimatePresence>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile top bar — no hamburger, just brand + avatar */}
        <div className="lg:hidden" style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: 'var(--color-card)', borderBottom: '1px solid var(--color-card-border)' }}>
          <span style={{ fontSize:'15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>BackToOwner</span>
          <div
            onClick={() => setMobileOpen(v => !v)}
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}
          >{user?.name?.charAt(0)}</div>
        </div>
        <main className="dashboard-main-content" style={{ flex: 1, overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  )
}
