import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '../components/DashboardLayout'
import { itemsAPI } from '../api/endpoints.js'
/* ─── Constants ──────────────────────────────────────────────────────── */
const CATEGORIES = [
  { value: 'electronics', label: 'Electronics',  emoji: '📱' },
  { value: 'stationery',  label: 'Stationery',   emoji: '✏️'  },
  { value: 'id-cards',    label: 'ID / Cards',   emoji: '🪪'  },
  { value: 'clothing',    label: 'Clothing',      emoji: '👕'  },
  { value: 'bags',        label: 'Bags',          emoji: '🎒'  },
  { value: 'keys',        label: 'Keys',          emoji: '🔑'  },
  { value: 'others',      label: 'Others',        emoji: '📦'  },
]
const LOCATION_GROUPS = [
  {
    group: '🚪 Main Entry & Roads',
    options: ['Main Gate (Kakatiya Thoranam)', 'Secondary Gate', 'Security Checkpoint', 'NH Road (Campus Divider)', 'Internal Campus Roads'],
  },
  {
    group: '🏢 Admin & Academic',
    options: ['Administrative Building', 'Director Office', 'Dean Offices', 'Academic Block 1 (AB-1)', 'Academic Block 2 (AB-2)', 'Lecture Hall Complex (LHC)', 'Seminar Hall', 'CSE Department', 'ECE Department', 'EEE Department', 'Mechanical Department', 'Civil Department', 'Chemical Department', 'Metallurgy Department', 'Biotechnology Department'],
  },
  {
    group: '🔬 Labs & Tech Centres',
    options: ['Central Computer Centre (CCC)', 'Mega Computer Centre', 'Physics Lab', 'Chemistry Lab', 'Electrical Machines Lab', 'Robotics Lab', 'IoT Lab', 'Mechatronics Lab', 'High Voltage Lab', 'Research Centre / Centre of Excellence'],
  },
  {
    group: '📚 Library & Study Areas',
    options: ['Central Library', 'Reading Room', 'Digital Library Section', 'Journal Section', 'Discussion Room'],
  },
  {
    group: '🏠 Boys Hostels',
    options: ['Ultra Mega Hostel (1.8K)', '1K Hostel', 'Hostel Block A', 'Hostel Block B', 'Hostel Block C', 'Hostel Block D', 'Hostel Block E', 'International Hostel'],
  },
  {
    group: '🏠 Girls Hostels',
    options: ['Sarojini Hostel', 'Girls Hostel Block'],
  },
  {
    group: '🍽️ Food & Eateries',
    options: ['IFC A (Institute Food Court)', 'IFC B', 'IFC C', 'Priyadarshini Mess (Girls)', 'Govt Mess (Boys)', 'New NIT Canteen', 'Staff Canteen', 'Nescafe', 'Café Coffee Day', 'BRU Outlet', 'Amul Outlet'],
  },
  {
    group: '🛒 Shopping & Services',
    options: ['Shopping Complex', 'Xerox Shop', 'Laundry Shop', 'Salon', 'Stationery Shop', 'General Store', 'SBI Bank', 'ATM', 'Post Office', 'Health Centre / Dispensary'],
  },
  {
    group: '🏋️ Sports & Fitness',
    options: ['Sports Complex', 'Indoor Games Complex', 'Cricket Ground', 'Football Ground', 'Basketball Court', 'Volleyball Court', 'Tennis Court', 'Gymnasium'],
  },
  {
    group: '🎭 Student Activity Areas',
    options: ['Student Activity Centre (SAC)', 'Auditorium', 'Open Air Theatre (OAT)', 'Club Rooms', 'Fest Ground (Technozion / Springspree)', 'Music & Dance Room'],
  },
  {
    group: '🏡 Faculty & Staff Areas',
    options: ['Faculty Quarters', 'Staff Quarters', 'Director Bungalow', 'Guest House'],
  },
  {
    group: '🚗 Transport & Utilities',
    options: ['Motor Transport Section (MT)', 'Parking Area', 'Bus Stop (Inside Campus)', 'Power Station'],
  },
  {
    group: '🌳 Campus Spots',
    options: ['Dept Lawn', 'Hostel Grounds', 'Lake / Green Zone', 'Back Gate Area', 'Shortcut Path (Hostel–Dept)', 'Night Walk Road'],
  },
  {
    group: '📍 Other',
    options: ['Others (specify below)'],
  },
]
const STEPS = ['Item Details', 'Location & Time', 'Review & Submit']
/* ─── Confetti ───────────────────────────────────────────────────────── */
function triggerConfetti() {
  const colors = ['#4F46E5','#10B981','#F43F5E','#F59E0B','#8B5CF6','#06B6D4']
  for (let i = 0; i < 120; i++) {
    const el = document.createElement('div')
    const size = Math.random() * 9 + 4
    const isRect = Math.random() > 0.5
    el.style.cssText = `position:fixed;z-index:9999;pointer-events:none;width:${size}px;height:${isRect ? size * 0.4 : size}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${isRect?'2px':'50%'};left:${Math.random()*100}vw;top:-12px`
    document.body.appendChild(el)
    el.animate([
      { transform:'translateY(0) rotate(0deg) scale(1)', opacity:1 },
      { transform:`translateY(${Math.random()*80+50}vh) rotate(${Math.random()*720-360}deg) scale(0.3)`, opacity:0 },
    ],{ duration:Math.random()*1200+800, delay:Math.random()*400, easing:'cubic-bezier(0.215,0.61,0.355,1)' })
    .onfinish = () => el.remove()
  }
}
/* ─── Progress Bar ───────────────────────────────────────────────────── */
function ProgressBar({ current }) {
  return (
    <div style={{ marginBottom:'36px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
        {/* Connector line background */}
        <div style={{ position:'absolute', top:'17px', left:'calc(50% - 160px)', right:'calc(50% - 160px)', height:'2px', background:'rgba(255,255,255,0.08)', zIndex:0 }}/>
        {/* Connector line fill */}
        <motion.div
          animate={{ width: current === 0 ? '0%' : current === 1 ? '50%' : '100%' }}
          transition={{ duration:0.5, ease:[0.4,0,0.2,1] }}
          style={{ position:'absolute', top:'17px', left:'calc(50% - 160px)', height:'2px', background:'linear-gradient(90deg,#4F46E5,#6366F1)', transformOrigin:'left', zIndex:1 }}
        />
        {/* Step Dots */}
        <div style={{ display:'flex', gap:'128px', position:'relative', zIndex:2 }}>
          {STEPS.map((label, i) => (
            <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'8px' }}>
              <motion.div
                animate={{
                  background: i <= current ? 'linear-gradient(135deg,#4F46E5,#6366F1)' : 'var(--color-card)',
                  boxShadow: i === current ? '0 0 0 4px rgba(79,70,229,0.25), 0 0 16px rgba(79,70,229,0.4)' : 'none',
                  scale: i === current ? 1.15 : 1,
                }}
                transition={{ duration:0.35 }}
                style={{
                  width:'34px', height:'34px', borderRadius:'50%',
                  border: i <= current ? 'none' : '2px solid rgba(255,255,255,0.1)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color: i <= current ? '#fff' : 'var(--color-text-muted)',
                  fontSize:'13px', fontWeight:700,
                }}
              >
                {i < current
                  ? <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : i + 1
                }
              </motion.div>
              <span style={{ fontSize:'11px', fontWeight: i === current ? 700 : 500, color: i <= current ? '#818CF8' : 'var(--color-text-muted)', whiteSpace:'nowrap', letterSpacing:'-0.01em' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
/* ─── Shared Input Styles ────────────────────────────────────────────── */
const inputStyle = (focused) => ({
  width:'100%', padding:'12px 16px', borderRadius:'12px', fontSize:'14px',
  background:'rgba(255,255,255,0.04)',
  border:`1px solid ${focused ? '#4F46E5' : 'rgba(255,255,255,0.1)'}`,
  color:'var(--color-text-primary)', outline:'none', fontFamily:'var(--font)',
  boxShadow: focused ? '0 0 0 3px rgba(79,70,229,0.15)' : 'none',
  transition:'border-color .2s, box-shadow .2s',
})
function Label({ children }) {
  return <label style={{ display:'block', fontSize:'13px', fontWeight:600, color:'var(--color-text-secondary)', marginBottom:'8px', letterSpacing:'-0.01em' }}>{children}</label>
}
function FieldWrap({ children, style }) {
  return <div style={{ marginBottom:'20px', ...style }}>{children}</div>
}
/* ─── Step 1: Item Details ───────────────────────────────────────────── */
function Step1({ data, setData }) {
  const [focusedName, setFocusedName]   = useState(false)
  const [focusedDesc, setFocusedDesc]   = useState(false)
  const [focusCat,    setFocusCat]      = useState(false)
  const [preview,     setPreview]       = useState(null)
  const fileRef = React.useRef()
  const MIN_DESC = 30

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setData(d => ({ ...d, image: file }))
    setPreview(URL.createObjectURL(file))
  }

  return (
    <div>
      <h2 style={{ fontSize:'22px', fontWeight:800, letterSpacing:'-0.03em', color:'var(--color-text-primary)', marginBottom:'4px' }}>Tell us about the item</h2>
      <p style={{ fontSize:'14px', color:'var(--color-text-secondary)', marginBottom:'28px' }}>Be as specific as possible — it helps our AI match faster.</p>

      {/* Photo Upload */}
      <FieldWrap>
        <Label>Photo (Optional)</Label>
        <div
          onClick={() => fileRef.current.click()}
          style={{ border:'2px dashed rgba(79,70,229,0.4)', borderRadius:'14px', padding:'20px', cursor:'pointer', display:'flex', alignItems:'center', gap:'16px', background:'rgba(79,70,229,0.03)', transition:'border-color .2s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor='rgba(79,70,229,0.7)'}
          onMouseLeave={e => e.currentTarget.style.borderColor='rgba(79,70,229,0.4)'}
        >
          {preview ? (
            <img src={preview} alt="preview" style={{ width:'72px', height:'72px', objectFit:'cover', borderRadius:'10px', flexShrink:0 }} />
          ) : (
            <div style={{ width:'72px', height:'72px', borderRadius:'10px', background:'rgba(79,70,229,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          )}
          <div>
            <p style={{ fontSize:'14px', fontWeight:600, color:'var(--color-text-primary)', marginBottom:'2px' }}>{preview ? 'Photo selected — click to change' : 'Click to upload a photo'}</p>
            <p style={{ fontSize:'12px', color:'var(--color-text-muted)' }}>JPG, PNG or WEBP • Max 5MB</p>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleImage} />
      </FieldWrap>

      <FieldWrap>
        <Label>Item Category</Label>
        <div style={{ position:'relative' }}>
          <select
            id="category-select"
            value={data.category}
            onChange={e => setData(d => ({ ...d, category: e.target.value }))}
            onFocus={() => setFocusCat(true)}
            onBlur={() => setFocusCat(false)}
            style={{ ...inputStyle(focusCat), appearance:'none', cursor:'pointer', paddingLeft: data.category ? '40px' : '16px' }}
          >
            <option value="" disabled style={{ background: '#1a1a2e', color: '#fff' }}>Select a category…</option>
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value} style={{ background: '#1a1a2e', color: '#fff' }}>{c.emoji}  {c.label}</option>
            ))}
          </select>
          {data.category && (
            <span style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', fontSize:'17px', pointerEvents:'none' }}>
              {CATEGORIES.find(c => c.value === data.category)?.emoji}
            </span>
          )}
          <svg viewBox="0 0 24 24" fill="none" width="15" height="15" style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'var(--color-text-muted)' }}>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </FieldWrap>
      {/* Custom Category Input */}
      <AnimatePresence>
        {data.category === 'others' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
            <FieldWrap>
              <Label>Specific Category</Label>
              <input
                type="text"
                value={data.customCategory}
                onChange={e => setData(d => ({ ...d, customCategory: e.target.value }))}
                placeholder="e.g. Water Bottle, Scientific Calculator"
                style={inputStyle(false)}
              />
            </FieldWrap>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Item Name */}
      <FieldWrap>
        <Label>Item Name</Label>
        <input
          id="item-name-input"
          type="text"
          value={data.itemName}
          onChange={e => setData(d => ({ ...d, itemName: e.target.value }))}
          onFocus={() => setFocusedName(true)}
          onBlur={() => setFocusedName(false)}
          placeholder="e.g. Black OnePlus 11 phone"
          style={inputStyle(focusedName)}
        />
      </FieldWrap>
      {/* Description */}
      <FieldWrap>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px' }}>
          <Label>Description</Label>
          <span style={{ fontSize:'12px', fontWeight:600, color: data.description.length >= MIN_DESC ? '#10B981' : 'var(--color-text-muted)' }}>
            {data.description.length} / {MIN_DESC}+ chars
          </span>
        </div>
        <textarea
          id="item-description-textarea"
          value={data.description}
          onChange={e => setData(d => ({ ...d, description: e.target.value }))}
          onFocus={() => setFocusedDesc(true)}
          onBlur={() => setFocusedDesc(false)}
          placeholder="Describe color, brand, distinguishing features, what was inside it, etc."
          rows={4}
          style={{ ...inputStyle(focusedDesc), resize:'vertical', lineHeight:1.65 }}
        />
        {/* Char bar */}
        <div style={{ height:'3px', borderRadius:'3px', background:'rgba(255,255,255,0.06)', marginTop:'6px', overflow:'hidden' }}>
          <motion.div animate={{ width:`${Math.min((data.description.length / MIN_DESC) * 100, 100)}%` }} transition={{ duration:0.3 }}
            style={{ height:'100%', borderRadius:'3px', background: data.description.length >= MIN_DESC ? '#10B981' : '#4F46E5' }}
          />
        </div>
        {data.description.length > 0 && data.description.length < MIN_DESC && (
          <p style={{ fontSize:'11px', color:'#F59E0B', marginTop:'5px', fontWeight:500 }}>
            Add {MIN_DESC - data.description.length} more characters for a better match.
          </p>
        )}
      </FieldWrap>
    </div>
  )
}
/* ─── Step 2: Location & Time ────────────────────────────────────────── */
function Step2({ data, setData }) {
  const [focusLoc,  setFocusLoc]  = useState(false)
  const [focusDate, setFocusDate] = useState(false)
  const [showTip,   setShowTip]   = useState(false)
  const today = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]
  return (
    <div>
      <h2 style={{ fontSize:'22px', fontWeight:800, letterSpacing:'-0.03em', color:'var(--color-text-primary)', marginBottom:'4px' }}>Where & when did you lose it?</h2>
      <p style={{ fontSize:'14px', color:'var(--color-text-secondary)', marginBottom:'28px' }}>Location and time help narrow down the search significantly.</p>
      {/* Location */}
      <FieldWrap>
        <Label>Campus Location</Label>
        <div style={{ position:'relative' }}>
          <select
            id="location-select"
            value={data.location}
            onChange={e => setData(d => ({ ...d, location: e.target.value }))}
            onFocus={() => setFocusLoc(true)}
            onBlur={() => setFocusLoc(false)}
            style={{ ...inputStyle(focusLoc), appearance:'none', cursor:'pointer' }}
          >
          <option value="" disabled style={{ background: '#1a1a2e', color: '#fff' }}>Select campus location…</option>
            {LOCATION_GROUPS.map(g => (
              <optgroup key={g.group} label={g.group} style={{ background: '#1a1a2e', color: '#94A3B8', fontWeight: 600 }}>
                {g.options.map(l => (
                  <option key={l} value={l} style={{ background: '#1a1a2e', color: '#fff', fontWeight: 400 }}>{l}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <svg viewBox="0 0 24 24" fill="none" width="15" height="15" style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'var(--color-text-muted)' }}>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </FieldWrap>
      {/* Custom Location Input */}
      <AnimatePresence>
        {data.location === 'Others (specify below)' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
            <FieldWrap>
              <Label>Specific Location</Label>
              <input
                type="text"
                value={data.customLocation}
                onChange={e => setData(d => ({ ...d, customLocation: e.target.value }))}
                placeholder="e.g. Room 304, Basketball Court"
                style={inputStyle(false)}
              />
            </FieldWrap>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Date */}
      <FieldWrap>
        <Label>Date Lost</Label>
        <input
          id="date-lost-input"
          type="date"
          value={data.dateLost}
          max={today}
          onChange={e => setData(d => ({ ...d, dateLost: e.target.value }))}
          onFocus={() => setFocusDate(true)}
          onBlur={() => setFocusDate(false)}
          style={{ ...inputStyle(focusDate), colorScheme:'dark' }}
        />
      </FieldWrap>
      {/* Visibility Toggle */}
      <FieldWrap>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
          <Label>Report Visibility</Label>
          {/* Tooltip */}
          <div style={{ position:'relative', display:'inline-flex' }}>
            <button
              type="button"
              id="visibility-info-btn"
              onMouseEnter={() => setShowTip(true)}
              onMouseLeave={() => setShowTip(false)}
              style={{ background:'none', border:'none', cursor:'pointer', color:'var(--color-text-muted)', display:'flex', marginBottom:'8px' }}
            >
              <svg viewBox="0 0 24 24" fill="none" width="15" height="15"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <AnimatePresence>
              {showTip && (
                <motion.div
                  initial={{ opacity:0, y:4, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, scale:0.95 }}
                  style={{ position:'absolute', bottom:'calc(100% + 6px)', left:'-100px', width:'240px', padding:'12px 14px', borderRadius:'12px', background:'#1a1a2e', border:'1px solid rgba(255,255,255,0.12)', fontSize:'12px', color:'var(--color-text-secondary)', lineHeight:1.6, zIndex:50, pointerEvents:'none', boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }}
                >
                  <strong style={{ color:'#F1F5F9', display:'block', marginBottom:'4px' }}>Visibility Options</strong>
                  <span style={{ color:'#818CF8' }}>Public:</span> Other students can see your report and help identify your item.<br/>
                  <span style={{ color:'#10B981' }}>Private:</span> Only the AI system and admins can see your report details.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div style={{ display:'flex', gap:'12px' }}>
          {['public','private'].map(v => (
            <motion.button
              key={v}
              type="button"
              id={`visibility-${v}-btn`}
              onClick={() => setData(d => ({ ...d, visibility: v }))}
              animate={{
                background: data.visibility === v
                  ? v === 'public' ? 'rgba(79,70,229,0.15)' : 'rgba(16,185,129,0.15)'
                  : 'rgba(255,255,255,0.03)',
                borderColor: data.visibility === v
                  ? v === 'public' ? 'rgba(79,70,229,0.6)' : 'rgba(16,185,129,0.6)'
                  : 'rgba(255,255,255,0.08)',
              }}
              transition={{ duration:0.2 }}
              style={{
                flex:1, padding:'14px', borderRadius:'14px', border:'1.5px solid',
                cursor:'pointer', display:'flex', alignItems:'center', gap:'10px',
              }}
            >
              <div style={{ width:'32px', height:'32px', borderRadius:'10px', background: v === 'public' ? 'rgba(79,70,229,0.2)' : 'rgba(16,185,129,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {v === 'public'
                  ? <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={data.visibility==='public'?'#818CF8':'#64748B'} strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke={data.visibility==='public'?'#818CF8':'#64748B'} strokeWidth="2"/></svg>
                  : <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><rect x="5" y="11" width="14" height="10" rx="2" stroke={data.visibility==='private'?'#10B981':'#64748B'} strokeWidth="2"/><path d="M8 11V7a4 4 0 018 0v4" stroke={data.visibility==='private'?'#10B981':'#64748B'} strokeWidth="2" strokeLinecap="round"/></svg>
                }
              </div>
              <div style={{ textAlign:'left' }}>
                <p style={{ fontSize:'13px', fontWeight:700, color: data.visibility === v ? (v==='public'?'#818CF8':'#10B981') : 'var(--color-text-secondary)', marginBottom:'1px', textTransform:'capitalize' }}>{v}</p>
                <p style={{ fontSize:'11px', color:'var(--color-text-muted)' }}>{v==='public'?'All students can see':'AI + Admin only'}</p>
              </div>
              {data.visibility === v && (
                <div style={{ marginLeft:'auto' }}>
                  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                    <circle cx="12" cy="12" r="10" fill={v==='public'?'rgba(79,70,229,0.3)':'rgba(16,185,129,0.3)'}/>
                    <path d="M8 12l3 3 5-5" stroke={v==='public'?'#818CF8':'#10B981'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </FieldWrap>
    </div>
  )
}
/* ─── Step 3: Review & Submit ────────────────────────────────────────── */
function Step3({ data, onSubmit, loading, success }) {
  const cat = CATEGORIES.find(c => c.value === data.category)
  return (
    <div>
      <h2 style={{ fontSize:'22px', fontWeight:800, letterSpacing:'-0.03em', color:'var(--color-text-primary)', marginBottom:'4px' }}>Review your report</h2>
      <p style={{ fontSize:'14px', color:'var(--color-text-secondary)', marginBottom:'24px' }}>Double-check everything before submitting.</p>
      {/* Summary Card */}
      <div style={{ padding:'20px', borderRadius:'18px', background:'rgba(79,70,229,0.07)', border:'1px solid rgba(79,70,229,0.2)', marginBottom:'24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
          {[
            { label:'Category',    value: data.category === 'others' && data.customCategory ? `📦 ${data.customCategory}` : (cat ? `${cat.emoji} ${cat.label}` : '—') },
            { label:'Visibility',  value: data.visibility === 'public' ? '🌐 Public' : '🔒 Private' },
            { label:'Item Name',   value: data.itemName   || '—' },
            { label:'Location',    value: data.location === 'Others (specify below)' && data.customLocation ? data.customLocation : (data.location || '—') },
            { label:'Date Lost',   value: data.dateLost ? new Date(data.dateLost).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) : '—' },
          ].map(({ label, value }) => (
            <div key={label} style={{ gridColumn: label === 'Item Name' ? 'span 2' : 'auto' }}>
              <p style={{ fontSize:'11px', fontWeight:700, letterSpacing:'0.05em', color:'var(--color-text-muted)', textTransform:'uppercase', marginBottom:'3px' }}>{label}</p>
              <p style={{ fontSize:'14px', fontWeight:600, color:'var(--color-text-primary)' }}>{value}</p>
            </div>
          ))}
          <div style={{ gridColumn:'span 2' }}>
            <p style={{ fontSize:'11px', fontWeight:700, letterSpacing:'0.05em', color:'var(--color-text-muted)', textTransform:'uppercase', marginBottom:'3px' }}>Description</p>
            <p style={{ fontSize:'14px', color:'var(--color-text-secondary)', lineHeight:1.6 }}>{data.description || '—'}</p>
          </div>
        </div>
      </div>
      {/* AI Matching Illustration */}
      <div style={{ display:'flex', alignItems:'center', gap:'16px', padding:'18px 20px', borderRadius:'16px', background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.2)', marginBottom:'28px' }}>
        <motion.div
          animate={{ rotate:360 }}
          transition={{ duration:4, repeat:Infinity, ease:'linear' }}
          style={{ width:'44px', height:'44px', borderRadius:'50%', background:'rgba(16,185,129,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'20px' }}
        >
          ✨
        </motion.div>
        <div>
          <p style={{ fontSize:'14px', fontWeight:700, color:'#34D399', marginBottom:'2px' }}>AI Matching Ready</p>
          <p style={{ fontSize:'12px', color:'var(--color-text-muted)', lineHeight:1.6 }}>
            Our NLP engine will start scanning found reports <strong style={{color:'var(--color-text-secondary)'}}>immediately</strong> after submission — matching by category, description, location & time.
          </p>
        </div>
      </div>
      {/* Submit Button */}
      {!success ? (
        <motion.button
          id="report-lost-submit-btn"
          type="button"
          onClick={onSubmit}
          disabled={loading}
          whileHover={!loading ? { scale:1.02, y:-1 } : {}}
          whileTap={!loading ? { scale:0.98 } : {}}
          style={{
            width:'100%', padding:'16px',
            borderRadius:'16px', border:'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize:'16px', fontWeight:800, letterSpacing:'-0.01em',
            color:'#fff', position:'relative', overflow:'hidden',
            background:'linear-gradient(135deg,#4F46E5 0%,#6366F1 100%)',
            boxShadow:'0 0 30px rgba(79,70,229,0.4)',
          }}
        >
          {loading && (
            <motion.div
              style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)', backgroundSize:'200% 100%' }}
              animate={{ backgroundPosition:['200% center','-200% center'] }}
              transition={{ duration:1.1, repeat:Infinity, ease:'linear' }}
            />
          )}
          <span style={{ position:'relative', zIndex:1 }}>
            {loading ? '🔄 Submitting…' : '🚀 Submit Lost Report'}
          </span>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
          style={{ width:'100%', padding:'18px', borderRadius:'16px', textAlign:'center', background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.3)' }}
        >
          <div style={{ fontSize:'32px', marginBottom:'8px' }}>🎉</div>
          <p style={{ fontSize:'16px', fontWeight:800, color:'#10B981', marginBottom:'3px' }}>Report Submitted!</p>
          <p style={{ fontSize:'13px', color:'var(--color-text-secondary)' }}>AI matching has started. You'll be notified when a match is found.</p>
        </motion.div>
      )}
    </div>
  )
}
/* ─── Step Transition Variants ───────────────────────────────────────── */
const stepVariants = {
  enter: (dir) => ({ x: dir > 0 ? 56 : -56, opacity: 0 }),
  center:        { x: 0, opacity: 1, transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } },
  exit:  (dir)  => ({ x: dir > 0 ? -56 : 56, opacity: 0, transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } }),
}
/* ─── Validation ─────────────────────────────────────────────────────── */
function validate(step, data) {
  if (step === 0) {
    if (!data.category)              return 'Please select a category.'
    if (data.category === 'others' && !data.customCategory.trim()) return 'Please enter your custom category.'
    if (!data.itemName.trim())       return 'Please enter the item name.'
    if (data.description.length < 30) return 'Description must be at least 30 characters.'
  }
  if (step === 1) {
    if (!data.location) return 'Please select a campus location.'
    if (data.location === 'Others (specify below)' && !data.customLocation.trim()) return 'Please enter your custom location.'
    if (!data.dateLost) return 'Please select the date you lost the item.'
  }
  return null
}
/* ─── Main Page ──────────────────────────────────────────────────────── */
export default function ReportLost() {
  const navigate = useNavigate()
  const [step,    setStep]    = useState(0)
  const [dir,     setDir]     = useState(1)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [data, setData] = useState({
    category: '', customCategory: '', itemName: '', description: '',
    location: '', customLocation: '', dateLost: '', visibility: 'public', image: null,
  })
  const go = (next) => {
    const err = validate(step, data)
    if (err) { setError(err); return }
    setError('')
    setDir(next > step ? 1 : -1)
    setStep(next)
  }
  const handleSubmit = async () => {
    setLoading(true)
    
    const mapCategory = {
      'electronics': 'Electronics',
      'stationery': 'Stationery',
      'id-cards': 'ID Card',
      'clothing': 'Clothing',
      'bags': 'Accessories',
      'keys': 'Keys',
      'others': 'Other'
    };

    try {
      const formData = new FormData()
      formData.append('title', data.itemName)
      formData.append('description', data.description)
      formData.append('category', mapCategory[data.category] || 'Other')

      let loc = data.location
      if (loc === 'Others (specify below)') loc = data.customLocation
      formData.append('location', loc)

      formData.append('visibility', data.visibility)
      if (data.image) formData.append('image', data.image)

      await itemsAPI.reportLost(formData)

      setLoading(false)
      setSuccess(true)
      triggerConfetti()
      setTimeout(() => navigate('/dashboard'), 2500)
    } catch (apiError) {
      setLoading(false)
      setError(apiError.response?.data?.message || 'Submission strictly rejected natively or connection dropped.')
    }
  }
  return (
    <DashboardLayout>
      <div style={{ maxWidth:'680px', margin: '0 auto', width:'100%' }}>
        {/* Back link */}
        <motion.button
          initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
          onClick={() => navigate('/dashboard')}
          style={{ display:'flex', alignItems:'center', gap:'6px', background:'none', border:'none', cursor:'pointer', color:'var(--color-text-muted)', fontSize:'13px', fontWeight:600, marginBottom:'28px', padding:0 }}
        >
          <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          Back to Dashboard
        </motion.button>
        {/* Page title */}
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:'32px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'6px' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:'linear-gradient(135deg,#4F46E5,#6366F1)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(79,70,229,0.4)' }}>
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2"/><path d="m21 21-4.35-4.35M11 8v3m0 0v3m0-3H8m3 0h3" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <h1 style={{ fontSize:'clamp(20px,3vw,26px)', fontWeight:800, letterSpacing:'-0.03em', color:'var(--color-text-primary)' }}>
              Report a Lost Item
            </h1>
          </div>
          <p style={{ fontSize:'14px', color:'var(--color-text-muted)', paddingLeft:'52px' }}>
            Step {step + 1} of {STEPS.length} — {STEPS[step]}
          </p>
        </motion.div>
        {/* Card */}
        <div style={{
          background:'var(--color-card)',
          border:'1px solid var(--color-card-border)',
          borderRadius:'24px',
          padding:'36px',
          boxShadow:'0 8px 40px rgba(0,0,0,0.2)',
          position:'relative', overflow:'hidden',
        }}>
          {/* Indigo glow corner */}
          <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'160px', height:'160px', borderRadius:'50%', background:'rgba(79,70,229,0.08)', filter:'blur(40px)', pointerEvents:'none' }}/>
          <ProgressBar current={step} />
          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                style={{ padding:'11px 14px', borderRadius:'10px', background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.3)', color:'#FB7185', fontSize:'13px', fontWeight:600, marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px' }}
              >
                <svg viewBox="0 0 24 24" fill="none" width="15" height="15"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          {/* Animated Step Content */}
          <div style={{ position:'relative', overflow:'hidden', minHeight:'340px' }}>
            <AnimatePresence custom={dir} mode="wait">
              <motion.div
                key={step}
                custom={dir}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {step === 0 && <Step1 data={data} setData={setData} />}
                {step === 1 && <Step2 data={data} setData={setData} />}
                {step === 2 && <Step3 data={data} onSubmit={handleSubmit} loading={loading} success={success} />}
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Navigation Buttons */}
          {!success && (
            <div style={{ display:'flex', justifyContent: step === 0 ? 'flex-end' : 'space-between', gap:'12px', marginTop:'28px', paddingTop:'20px', borderTop:'1px solid var(--color-card-border)' }}>
              {step > 0 && (
                <motion.button
                  id="step-back-btn"
                  type="button"
                  onClick={() => { setError(''); setDir(-1); setStep(s => s - 1) }}
                  whileHover={{ scale:1.02 }}
                  whileTap={{ scale:0.97 }}
                  style={{
                    padding:'12px 28px', borderRadius:'12px', border:'1.5px solid var(--color-card-border)',
                    background:'transparent', color:'var(--color-text-secondary)',
                    fontSize:'14px', fontWeight:600, cursor:'pointer', transition:'all .2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='#4F46E5'; e.currentTarget.style.color='#818CF8' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--color-card-border)'; e.currentTarget.style.color='var(--color-text-secondary)' }}
                >
                  ← Back
                </motion.button>
              )}
              {step < 2 && (
                <motion.button
                  id="step-next-btn"
                  type="button"
                  onClick={() => go(step + 1)}
                  whileHover={{ scale:1.03, y:-1 }}
                  whileTap={{ scale:0.97 }}
                  style={{
                    padding:'12px 32px', borderRadius:'12px', border:'none',
                    background:'linear-gradient(135deg,#4F46E5,#6366F1)',
                    color:'#fff', fontSize:'14px', fontWeight:700, cursor:'pointer',
                    boxShadow:'0 4px 16px rgba(79,70,229,0.35)',
                  }}
                >
                  Continue →
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
