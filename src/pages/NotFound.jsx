import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
export default function NotFound() {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '72px', fontWeight: 900, color: '#4F46E5', marginBottom: '16px' }}>404</h1>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Page Not Found</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>The item you are looking for has not been found in our system.</p>
        <Link to="/" style={{ padding: '12px 24px', background: '#4F46E5', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: 600 }}>
          Go Home
        </Link>
      </motion.div>
    </div>
  )
}
