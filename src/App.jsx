import React, { useState, useEffect, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import { AuthProvider } from './context/AuthContext'
import Navbar     from './components/Navbar'
import Hero       from './components/Hero'
import HowItWorks from './components/HowItWorks'
import StatsBar   from './components/StatsBar'
import Login          from './pages/Login'
import Register       from './pages/Register'
import Dashboard      from './pages/Dashboard'
import ReportLost     from './pages/ReportLost'
import ReportFound    from './pages/ReportFound'
import Notifications  from './pages/Notifications'
import SecureChat     from './pages/SecureChat'
import ActiveChats    from './pages/ActiveChats'
import MyReports      from './pages/MyReports'
import AdminDashboard from './pages/AdminDashboard'
import Profile        from './pages/Profile'
import NotFound       from './pages/NotFound'
import About          from './pages/About'
/* ─── Landing Page ───────────────────────────────────────────────────── */
function LandingPage({ isDark, toggleDark }) {
  return (
    <>
      <Navbar isDark={isDark} toggleDark={toggleDark} />
      <main>
        <Hero />
        <HowItWorks />
        <StatsBar />
      </main>
    </>
  )
}
/* ─── Page Transition Wrapper ────────────────────────────────────────── */
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    style={{ minHeight: '100vh', background: 'var(--color-bg)' }}
  >
    {children}
  </motion.div>
)
/* ─── Animated Routes ────────────────────────────────────────────────── */
function AnimatedRoutes({ isDark, toggleDark }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageWrapper><LandingPage isDark={isDark} toggleDark={toggleDark} /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        {/* Protected Student Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
        <Route path="/report-lost" element={<ProtectedRoute><PageWrapper><ReportLost /></PageWrapper></ProtectedRoute>} />
        <Route path="/report-found" element={<ProtectedRoute><PageWrapper><ReportFound /></PageWrapper></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><PageWrapper><Notifications /></PageWrapper></ProtectedRoute>} />
        <Route path="/chats" element={<ProtectedRoute><PageWrapper><ActiveChats /></PageWrapper></ProtectedRoute>} />
        <Route path="/chat/:chatId" element={<ProtectedRoute><PageWrapper><SecureChat /></PageWrapper></ProtectedRoute>} />
        <Route path="/my-reports" element={<ProtectedRoute><PageWrapper><MyReports /></PageWrapper></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><PageWrapper><About /></PageWrapper></ProtectedRoute>} />
        {/* Admin Route */}
        <Route path="/admin" element={<AdminRoute><PageWrapper><AdminDashboard /></PageWrapper></AdminRoute>} />
        {/* 404 Route */}
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}
/* ─── App Root ───────────────────────────────────────────────────────── */
function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('backtoowner-theme')
    return saved ? saved === 'dark' : true
  })
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark',  isDark)
    root.classList.toggle('light', !isDark)
    localStorage.setItem('backtoowner-theme', isDark ? 'dark' : 'light')
  }, [isDark])
  const toggleDark = () => setIsDark(v => !v)
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
          <AnimatedRoutes isDark={isDark} toggleDark={toggleDark} />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
export default App
