import React, { useState } from 'react'
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'
import { authAPI } from '../api/endpoints.js'
/* ─── Input Field ────────────────────────────────────────────────────── */
function InputField({ id, label, type = 'text', value, onChange, error, placeholder, rightEl, autoComplete }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <label htmlFor={id} style={{ display:'block', fontSize:'13px', fontWeight:600, color:'var(--color-text-secondary)', marginBottom:'7px', letterSpacing:'-0.01em' }}>
        {label}
      </label>
      <div style={{ position:'relative' }}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{
            width:'100%', padding:'13px 16px',
            paddingRight: rightEl ? '48px' : '16px',
            borderRadius:'12px', fontSize:'15px',
            background:'rgba(255,255,255,0.04)',
            border:`1px solid ${error ? '#F43F5E' : 'rgba(255,255,255,0.1)'}`,
            color:'var(--color-text-primary)',
            outline:'none', fontFamily:'var(--font)',
            transition:'border-color .2s, box-shadow .2s',
          }}
          onFocus={e => {
            if (!error) e.target.style.borderColor = '#4F46E5'
            e.target.style.boxShadow = error ? '0 0 0 3px rgba(244,63,94,0.15)' : '0 0 0 3px rgba(79,70,229,0.15)'
          }}
          onBlur={e => {
            if (!error) e.target.style.borderColor = 'rgba(255,255,255,0.1)'
            e.target.style.boxShadow = 'none'
          }}
        />
        {rightEl && (
          <div style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)' }}>
            {rightEl}
          </div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }}
            style={{ fontSize:'12px', color:'#F43F5E', marginTop:'6px', fontWeight:500 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
/* ─── Login Page ─────────────────────────────────────────────────────── */
export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [emailErr,  setEmailErr]  = useState('')
  const [passErr,   setPassErr]   = useState('')
  const [shakeKey,  setShakeKey]  = useState(0)
  const [loading,   setLoading]   = useState(false)
  const [success,   setSuccess]   = useState(false)
  const validateEmail = (val) => {
    if (!val) return 'Email is required'
    if (!val.endsWith('@student.nitw.ac.in') && val !== 'admin123@nitw.ac.in') return 'Only student/admin emails allowed'
    return ''
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const eErr = validateEmail(email)
    const pErr = password.length < 6 ? 'Password must be at least 6 characters' : ''
    if (eErr) { setEmailErr(eErr); setShakeKey(k => k + 1) }
    if (pErr)   setPassErr(pErr)
    if (eErr || pErr) return
    setLoading(true)
    
    try {
      const dbResponse = await authAPI.login({ email, password })
      login(dbResponse.user, dbResponse.token)
      setLoading(false)
      setSuccess(true)
      const destination = location.state?.from || '/dashboard'
      setTimeout(() => navigate(destination), 800)
    } catch (err) {
      setLoading(false)
      if (err.response && err.response.data && err.response.data.message) {
        setPassErr(err.response.data.message)
      } else {
        setPassErr('Network connection aborted or denied.')
      }
      setShakeKey(k => k + 1)
    }
  }
  const EyeBtn = (
    <button
      type="button"
      id="toggle-password-visibility"
      onClick={() => setShowPass(v => !v)}
      style={{ background:'none', border:'none', cursor:'pointer', color:'var(--color-text-muted)', display:'flex', alignItems:'center' }}
    >
      {showPass ? (
        <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
      )}
    </button>
  )
  return (
    <AuthLayout>
      <motion.div
        key="login-card"
        initial={{ opacity:0, y:40, scale:0.97 }}
        animate={{ opacity:1, y:0,  scale:1 }}
        transition={{ type:'spring', stiffness:200, damping:22 }}
        style={{
          background:'rgba(26,26,46,0.7)',
          border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:'24px',
          padding:'40px 36px',
          backdropFilter:'blur(24px)',
          boxShadow:'0 0 0 1px rgba(79,70,229,0.1), 0 32px 80px rgba(0,0,0,0.4)',
        }}
      >
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'32px' }}>
          <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg,#4F46E5,#6366F1)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(79,70,229,0.5)' }}>
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M16 6V5a3 3 0 00-3-3h-2a3 3 0 00-3 3v1" stroke="white" strokeWidth="2" strokeLinecap="round"/><rect x="2" y="6" width="20" height="15" rx="3" stroke="white" strokeWidth="2" fill="none"/></svg>
          </div>
          <span style={{ fontSize:'16px', fontWeight:700, letterSpacing:'-0.02em', color:'#F1F5F9' }}>Back<span style={{color:'#4F46E5'}}>To</span>Owner</span>
        </div>
        {/* Heading */}
        <h1 style={{ fontSize:'28px', fontWeight:800, letterSpacing:'-0.035em', color:'#F1F5F9', marginBottom:'6px' }}>
          Welcome back, Warrior.
        </h1>
        <p style={{ fontSize:'14px', color:'#64748B', marginBottom:'32px', lineHeight:1.6 }}>
          Sign in to your NIT Warangal account.
        </p>
        <form onSubmit={handleSubmit} noValidate>
          {/* Email with shake */}
          <motion.div
            key={shakeKey}
            animate={shakeKey > 0 ? { x: [0,-12,12,-10,10,-6,6,0] } : {}}
            transition={{ duration:0.45 }}
          >
            <InputField
              id="login-email"
              label="College Email"
              type="email"
              value={email}
              placeholder="yourname@nitw.ac.in"
              autoComplete="email"
              error={emailErr}
              onChange={e => { setEmail(e.target.value); if (emailErr) setEmailErr('') }}
            />
          </motion.div>
          {/* Password */}
          <InputField
            id="login-password"
            label="Password"
            type={showPass ? 'text' : 'password'}
            value={password}
            placeholder="Enter your password"
            autoComplete="current-password"
            error={passErr}
            rightEl={EyeBtn}
            onChange={e => { setPassword(e.target.value); if (passErr) setPassErr('') }}
          />
          {/* Forgot password */}
          <div style={{ textAlign:'right', marginTop:'-10px', marginBottom:'24px' }}>
            <a href="#" style={{ fontSize:'13px', color:'#4F46E5', fontWeight:600, textDecoration:'none' }}>Forgot password?</a>
          </div>
          {/* Submit Button */}
          <motion.button
            id="login-submit-btn"
            type="submit"
            disabled={loading || success}
            whileHover={!loading ? { scale:1.02, y:-1 } : {}}
            whileTap={!loading ? { scale:0.98 } : {}}
            style={{
              width:'100%', padding:'15px',
              borderRadius:'14px', border:'none', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize:'15px', fontWeight:700, letterSpacing:'-0.01em',
              color:'#fff', overflow:'hidden', position:'relative',
              background: success
                ? 'linear-gradient(135deg, #10B981, #059669)'
                : 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
              transition:'background .4s',
            }}
          >
            {/* Shimmer overlay while loading */}
            {loading && (
              <motion.div
                style={{
                  position:'absolute', inset:0,
                  background:'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)',
                  backgroundSize:'200% 100%',
                }}
                animate={{ backgroundPosition: ['200% center', '-200% center'] }}
                transition={{ duration:1.2, repeat:Infinity, ease:'linear' }}
              />
            )}
            <span style={{ position:'relative', zIndex:1 }}>
              {success ? '✓ Signed in!' : loading ? 'Signing in…' : 'Sign In'}
            </span>
          </motion.button>
        </form>
        {/* Divider */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px', margin:'24px 0' }}>
          <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.07)' }}/>
          <span style={{ fontSize:'12px', color:'#334155', fontWeight:500 }}>Don't have an account?</span>
          <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,0.07)' }}/>
        </div>
        <Link
          to="/register"
          id="goto-register-link"
          style={{
            display:'block', textAlign:'center', padding:'13px', borderRadius:'14px',
            border:'1.5px solid rgba(79,70,229,0.35)',
            color:'#818CF8', fontSize:'14px', fontWeight:700, textDecoration:'none',
            transition:'all .25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(79,70,229,0.08)'; e.currentTarget.style.borderColor='rgba(79,70,229,0.6)' }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(79,70,229,0.35)' }}
        >
          Create an account →
        </Link>
      </motion.div>
    </AuthLayout>
  )
}
