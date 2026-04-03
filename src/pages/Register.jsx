import React, { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AuthLayout from '../components/AuthLayout'
import { authAPI } from '../api/endpoints.js'
/* ─── Confetti Burst ─────────────────────────────────────────────────── */
function triggerConfetti() {
  const colors = ['#4F46E5','#10B981','#F43F5E','#F59E0B','#8B5CF6','#06B6D4']
  for (let i = 0; i < 140; i++) {
    const el = document.createElement('div')
    const size = Math.random() * 9 + 4
    const isRect = Math.random() > 0.5
    el.style.cssText = `
      position:fixed; z-index:9999; pointer-events:none;
      width:${size}px; height:${isRect ? size * 0.4 : size}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      border-radius:${isRect ? '2px' : '50%'};
      left:${Math.random() * 100}vw; top:-12px;
    `
    document.body.appendChild(el)
    el.animate([
      { transform:`translateY(0) rotate(0deg) scale(1)`, opacity:1 },
      { transform:`translateY(${Math.random()*85+55}vh) rotate(${Math.random()*720-360}deg) scale(0.3)`, opacity:0 },
    ], {
      duration: Math.random() * 1400 + 900,
      delay: Math.random() * 400,
      easing: 'cubic-bezier(0.215,0.61,0.355,1)',
    }).onfinish = () => el.remove()
  }
}
/* ─── Password Strength ──────────────────────────────────────────────── */
function getStrength(pw) {
  let score = 0
  if (pw.length >= 8)        score++
  if (/[A-Z]/.test(pw))      score++
  if (/[0-9]/.test(pw))      score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { label:'Weak',   color:'#F43F5E', width:'25%' }
  if (score <= 2) return { label:'Fair',   color:'#F59E0B', width:'50%' }
  if (score === 3) return { label:'Good',  color:'#4F46E5', width:'75%' }
  return              { label:'Strong', color:'#10B981', width:'100%' }
}
/* ─── Check Icon ─────────────────────────────────────────────────────── */
function CheckIcon({ valid }) {
  return (
    <AnimatePresence>
      {valid && (
        <motion.span
          initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0 }}
          style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)' }}
        >
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <circle cx="12" cy="12" r="10" fill="#10B981" fillOpacity="0.15"/>
            <path d="M8 12l3 3 5-5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.span>
      )}
    </AnimatePresence>
  )
}
/* ─── Validated Input ────────────────────────────────────────────────── */
function ValidatedInput({ id, label, type='text', value, onChange, error, placeholder, valid, rightEl, autoComplete }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom:'16px' }}>
      <label htmlFor={id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:'13px', fontWeight:600, color:'var(--color-text-secondary)', marginBottom:'7px' }}>
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
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width:'100%', padding:'12px 16px',
            paddingRight: (valid || rightEl) ? '44px' : '16px',
            borderRadius:'12px', fontSize:'14px',
            background:'rgba(255,255,255,0.04)',
            border:`1px solid ${error ? '#F43F5E' : valid ? 'rgba(16,185,129,0.5)' : focused ? '#4F46E5' : 'rgba(255,255,255,0.1)'}`,
            color:'var(--color-text-primary)',
            outline:'none', fontFamily:'var(--font)',
            boxShadow: focused ? (error ? '0 0 0 3px rgba(244,63,94,0.12)' : '0 0 0 3px rgba(79,70,229,0.12)'): 'none',
            transition:'border-color .2s, box-shadow .2s',
          }}
        />
        {rightEl ? (
          <div style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)' }}>{rightEl}</div>
        ) : (
          <CheckIcon valid={valid} />
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            style={{ fontSize:'12px', color:'#F43F5E', marginTop:'5px', fontWeight:500 }}>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
/* ─── Register Page ──────────────────────────────────────────────────── */
export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:'', roll:'', email:'', password:'', confirm:'' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
  }
  /* Validity checks (green checkmarks) */
  const valid = {
    name:     form.name.trim().length >= 2,
    roll:     /^[A-Z0-9]{5,12}$/i.test(form.roll.trim()),
    email:    (form.email.endsWith('@student.nitw.ac.in') || form.email === 'admin123@nitw.ac.in'),
    password: form.password.length >= 6,
    confirm:  form.confirm.length > 0 && form.confirm === form.password,
  }
  const strength = form.password ? getStrength(form.password) : null
  const EyeBtn = (field, show, setShow) => (
    <button type="button" onClick={() => setShow(v=>!v)}
      style={{ background:'none', border:'none', cursor:'pointer', color:'var(--color-text-muted)', display:'flex' }}>
      {show
        ? <svg viewBox="0 0 24 24" fill="none" width="17" height="17"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        : <svg viewBox="0 0 24 24" fill="none" width="17" height="17"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
      }
    </button>
  )
  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErr = {}
    if (!valid.name)     newErr.name    = 'Enter your full name'
    if (!valid.roll)     newErr.roll    = 'Enter a valid roll number (e.g. 22CSB0001)'
    if (!valid.email)    newErr.email   = 'Only @nitw.ac.in emails allowed'
    if (!valid.password) newErr.password= 'Password must be at least 6 characters'
    if (!valid.confirm)  newErr.confirm = form.confirm ? 'Passwords do not match' : 'Please confirm your password'
    if (Object.keys(newErr).length > 0) { setErrors(newErr); return }
    setLoading(true)
    try {
      await authAPI.register({
        name: form.name,
        email: form.email,
        password: form.password,
        roll: form.roll
      })
      setLoading(false)
      triggerConfetti()
      setTimeout(() => navigate('/login'), 1800)
    } catch (err) {
      setLoading(false)
      if (err.response && err.response.data && err.response.data.message) {
        setErrors({ email: err.response.data.message })
      } else if (err.response?.data?.errors) {
        const backendErrs = {}
        err.response.data.errors.forEach(e => { backendErrs[e.field] = e.message })
        setErrors({ ...errors, ...backendErrs })
      } else {
        setErrors({ email: 'Registration failed unexpectedly.' })
      }
    }
  }
  const allValid = Object.values(valid).every(Boolean)
  return (
    <AuthLayout>
      <motion.div
        key="register-card"
        initial={{ opacity:0, y:40, scale:0.97 }}
        animate={{ opacity:1, y:0,  scale:1 }}
        transition={{ type:'spring', stiffness:200, damping:22 }}
        style={{
          background:'rgba(26,26,46,0.7)',
          border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:'24px',
          padding:'36px 34px',
          backdropFilter:'blur(24px)',
          boxShadow:'0 0 0 1px rgba(79,70,229,0.1), 0 32px 80px rgba(0,0,0,0.4)',
        }}
      >
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'28px' }}>
          <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:'linear-gradient(135deg,#4F46E5,#6366F1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg viewBox="0 0 24 24" fill="none" width="17" height="17"><path d="M16 6V5a3 3 0 00-3-3h-2a3 3 0 00-3 3v1" stroke="white" strokeWidth="2" strokeLinecap="round"/><rect x="2" y="6" width="20" height="15" rx="3" stroke="white" strokeWidth="2" fill="none"/></svg>
          </div>
          <span style={{ fontSize:'15px', fontWeight:700, letterSpacing:'-0.02em', color:'#F1F5F9' }}>Back<span style={{color:'#4F46E5'}}>To</span>Owner</span>
        </div>
        <h1 style={{ fontSize:'26px', fontWeight:800, letterSpacing:'-0.035em', color:'#F1F5F9', marginBottom:'4px' }}>
          Join BackToOwner
        </h1>
        <p style={{ fontSize:'13px', color:'#64748B', marginBottom:'28px' }}>
          NIT Warangal students only · Verify with your college email.
        </p>
        <form onSubmit={handleSubmit} noValidate>
          <ValidatedInput id="reg-name"    label="Full Name"           value={form.name}     onChange={set('name')}     error={errors.name}     placeholder="e.g. Arjun Reddy"    valid={valid.name}     autoComplete="name"/>
          <ValidatedInput id="reg-roll"    label="College Roll Number" value={form.roll}     onChange={set('roll')}     error={errors.roll}     placeholder="e.g. 22CSB0001"      valid={valid.roll}     autoComplete="off"/>
          <ValidatedInput id="reg-email"   label="College Email"       value={form.email}    onChange={set('email')}    error={errors.email}    placeholder="yourname@nitw.ac.in"  valid={valid.email}    type="email" autoComplete="email"/>
          {/* Password */}
          <ValidatedInput
            id="reg-password" label="Password"
            type={showPass ? 'text' : 'password'}
            value={form.password} onChange={set('password')} error={errors.password}
            placeholder="Min. 8 chars, uppercase, number"
            valid={false}
            rightEl={EyeBtn('password', showPass, setShowPass)}
            autoComplete="new-password"
          />
          {/* Strength Meter */}
          {form.password && strength && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} style={{ marginTop:'-8px', marginBottom:'14px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'5px' }}>
                <span style={{ fontSize:'11px', color:'#475569', fontWeight:600 }}>Password strength</span>
                <span style={{ fontSize:'11px', fontWeight:700, color:strength.color }}>{strength.label}</span>
              </div>
              <div style={{ height:'4px', borderRadius:'4px', background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
                <motion.div
                  initial={{ width:0 }}
                  animate={{ width:strength.width }}
                  transition={{ duration:0.4, ease:'easeOut' }}
                  style={{ height:'100%', borderRadius:'4px', background:strength.color, boxShadow:`0 0 8px ${strength.color}` }}
                />
              </div>
            </motion.div>
          )}
          {/* Confirm Password */}
          <ValidatedInput
            id="reg-confirm" label="Confirm Password"
            type={showConfirm ? 'text' : 'password'}
            value={form.confirm} onChange={set('confirm')} error={errors.confirm}
            placeholder="Re-enter your password"
            valid={valid.confirm}
            rightEl={!valid.confirm ? EyeBtn('confirm', showConfirm, setShowConfirm) : undefined}
            autoComplete="new-password"
          />
          {/* Progress dots */}
          <div style={{ display:'flex', gap:'6px', marginBottom:'20px' }}>
            {Object.entries(valid).map(([k, v]) => (
              <motion.div
                key={k}
                animate={{ background: v ? '#10B981' : 'rgba(255,255,255,0.1)', scale: v ? 1.2 : 1 }}
                transition={{ duration:0.25 }}
                style={{ flex:1, height:'3px', borderRadius:'3px' }}
              />
            ))}
          </div>
          {/* Submit */}
          <motion.button
            id="register-submit-btn"
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale:1.02, y:-1 } : {}}
            whileTap={!loading ? { scale:0.98 } : {}}
            style={{
              width:'100%', padding:'14px',
              borderRadius:'14px', border:'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize:'15px', fontWeight:700, letterSpacing:'-0.01em',
              color:'#fff', position:'relative', overflow:'hidden',
              background: allValid
                ? 'linear-gradient(135deg, #10B981, #059669)'
                : 'linear-gradient(135deg, #4F46E5, #6366F1)',
              transition:'background .5s',
              boxShadow: allValid ? '0 0 24px rgba(16,185,129,0.4)' : '0 0 24px rgba(79,70,229,0.3)',
            }}
          >
            {loading && (
              <motion.div
                style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)', backgroundSize:'200% 100%' }}
                animate={{ backgroundPosition:['200% center','-200% center'] }}
                transition={{ duration:1.2, repeat:Infinity, ease:'linear' }}
              />
            )}
            <span style={{ position:'relative', zIndex:1 }}>
              {loading ? 'Creating account…' : 'Create Account'}
            </span>
          </motion.button>
        </form>
        {/* Link to Login */}
        <div style={{ textAlign:'center', marginTop:'20px' }}>
          <span style={{ fontSize:'13px', color:'#475569' }}>Already have an account? </span>
          <Link to="/login" id="goto-login-link" style={{ fontSize:'13px', fontWeight:700, color:'#818CF8', textDecoration:'none' }}>
            Sign in →
          </Link>
        </div>
      </motion.div>
    </AuthLayout>
  )
}
