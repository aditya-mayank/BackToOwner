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
  { value: 'clothing',    label: 'Clothing',     emoji: '👕'  },
  { value: 'bags',        label: 'Bags',         emoji: '🎒'  },
  { value: 'keys',        label: 'Keys',         emoji: '🔑'  },
  { value: 'others',      label: 'Others',       emoji: '📦'  },
]
const LOCATION_GROUPS = [
  { group: '🚪 Main Entry & Roads', options: ['Main Gate (Kakatiya Thoranam)', 'Secondary Gate', 'Security Checkpoint', 'NH Road (Campus Divider)', 'Internal Campus Roads'] },
  { group: '🏢 Admin & Academic', options: ['Administrative Building', 'Director Office', 'Dean Offices', 'Academic Block 1 (AB-1)', 'Academic Block 2 (AB-2)', 'Lecture Hall Complex (LHC)', 'Seminar Hall', 'CSE Department', 'ECE Department', 'EEE Department', 'Mechanical Department', 'Civil Department', 'Chemical Department', 'Metallurgy Department', 'Biotechnology Department'] },
  { group: '🔬 Labs & Tech Centres', options: ['Central Computer Centre (CCC)', 'Mega Computer Centre', 'Physics Lab', 'Chemistry Lab', 'Electrical Machines Lab', 'Robotics Lab', 'IoT Lab', 'Mechatronics Lab', 'High Voltage Lab', 'Research Centre / Centre of Excellence'] },
  { group: '📚 Library & Study Areas', options: ['Central Library', 'Reading Room', 'Digital Library Section', 'Journal Section', 'Discussion Room'] },
  { group: '🏠 Boys Hostels', options: ['Ultra Mega Hostel (1.8K)', '1K Hostel', 'Hostel Block A', 'Hostel Block B', 'Hostel Block C', 'Hostel Block D', 'Hostel Block E', 'International Hostel'] },
  { group: '🏠 Girls Hostels', options: ['Sarojini Hostel', 'Girls Hostel Block'] },
  { group: '🍽️ Food & Eateries', options: ['IFC A (Institute Food Court)', 'IFC B', 'IFC C', 'Priyadarshini Mess (Girls)', 'Govt Mess (Boys)', 'New NIT Canteen', 'Staff Canteen', 'Nescafe', 'Café Coffee Day', 'BRU Outlet', 'Amul Outlet'] },
  { group: '🛒 Shopping & Services', options: ['Shopping Complex', 'Xerox Shop', 'Laundry Shop', 'Salon', 'Stationery Shop', 'General Store', 'SBI Bank', 'ATM', 'Post Office', 'Health Centre / Dispensary'] },
  { group: '🏋️ Sports & Fitness', options: ['Sports Complex', 'Indoor Games Complex', 'Cricket Ground', 'Football Ground', 'Basketball Court', 'Volleyball Court', 'Tennis Court', 'Gymnasium'] },
  { group: '🎭 Student Activity Areas', options: ['Student Activity Centre (SAC)', 'Auditorium', 'Open Air Theatre (OAT)', 'Club Rooms', 'Fest Ground (Technozion / Springspree)', 'Music & Dance Room'] },
  { group: '🏡 Faculty & Staff Areas', options: ['Faculty Quarters', 'Staff Quarters', 'Director Bungalow', 'Guest House'] },
  { group: '🚗 Transport & Utilities', options: ['Motor Transport Section (MT)', 'Parking Area', 'Bus Stop (Inside Campus)', 'Power Station'] },
  { group: '🌳 Campus Spots', options: ['Dept Lawn', 'Hostel Grounds', 'Lake / Green Zone', 'Back Gate Area', 'Shortcut Path (Hostel–Dept)', 'Night Walk Road'] },
  { group: '📍 Other', options: ['Others (specify below)'] },
]
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
/* ─── Shared Styles ──────────────────────────────────────────────────── */
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
/* ─── Main Component ─────────────────────────────────────────────────── */
export default function ReportFound() {
  const navigate = useNavigate()
  const [data, setData] = useState({
    category: '', customCategory: '', itemName: '', description: '',
    location: '', customLocation: '', dateFound: '', photo: null, photoUrl: ''
  })
  const [focusCat, setFocusCat]   = useState(false)
  const [focusName, setFocusName] = useState(false)
  const [focusDesc, setFocusDesc] = useState(false)
  const [focusLoc, setFocusLoc]   = useState(false)
  const [focusDate, setFocusDate] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)
  const today = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  const handlePhotoUpload = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.')
      return
    }
    // Simulate upload progress
    const reader = new FileReader()
    reader.onloadstart = () => {
      setUploadProgress(10)
      const interval = setInterval(() => {
        setUploadProgress(p => {
          if (p >= 90) { clearInterval(interval); return p }
          return p + 20
        })
      }, 50)
      setTimeout(() => clearInterval(interval), 500)
    }
    reader.onload = (e) => {
      setUploadProgress(100)
      setTimeout(() => {
        setData(d => ({ ...d, photo: file, photoUrl: e.target.result }))
        setUploadProgress(0)
      }, 300)
    }
    reader.readAsDataURL(file)
  }
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handlePhotoUpload(file)
  }
  const validate = () => {
    if (!data.category) return 'Please select a category.'
    if (data.category === 'others' && !data.customCategory.trim()) return 'Please enter a custom category.'
    if (!data.itemName.trim()) return 'Please enter the item name.'
    if (!data.location) return 'Please select where you found it.'
    if (data.location === 'Others (specify below)' && !data.customLocation.trim()) return 'Please enter the specific location.'
    if (!data.dateFound) return 'Please select when you found it.'
    return null
  }
  const handleSubmit = async () => {
    const err = validate()
    if (err) {
      setError(err)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setError('')
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
      const formData = new FormData();
      formData.append('title', data.itemName);
      formData.append('description', data.description || 'Found item securely reported relative to map parameters.');
      formData.append('category', mapCategory[data.category] || 'Other');
      
      let loc = data.location;
      if (loc === 'Others (specify below)') loc = data.customLocation;
      formData.append('location', loc);
      
      formData.append('visibility', 'public');
      if (data.photo) formData.append('image', data.photo);

      await itemsAPI.reportFound(formData);

      setLoading(false)
      setSuccess(true)
      triggerConfetti()
      setTimeout(() => navigate('/dashboard'), 3500)
    } catch (apiError) {
      setLoading(false)
      setError(apiError.response?.data?.message || 'Secure item upload aborted or disconnected. Please try again.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  return (
    <DashboardLayout>
      <div style={{ maxWidth:'680px', margin:'0 auto', width:'100%' }}>
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
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:'28px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'6px' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:'linear-gradient(135deg,#10B981,#34D399)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(16,185,129,0.3)' }}>
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h1 style={{ fontSize:'clamp(20px,3vw,26px)', fontWeight:800, letterSpacing:'-0.03em', color:'var(--color-text-primary)' }}>
              Report a Found Item
            </h1>
          </div>
          <p style={{ fontSize:'14px', color:'var(--color-text-muted)', paddingLeft:'52px' }}>
            Help a fellow Warrior get their item back.
          </p>
        </motion.div>
        {/* Privacy Banner */}
        <motion.div 
          initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.1 }}
          style={{ display:'flex', alignItems:'flex-start', gap:'16px', padding:'16px 20px', borderRadius:'16px', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)', marginBottom:'32px' }}
        >
          <div style={{ minWidth:'24px', height:'24px', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(245,158,11,0.2)', borderRadius:'50%', color:'#F59E0B' }}>
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <div>
            <p style={{ fontSize:'14px', fontWeight:700, color:'#F59E0B', marginBottom:'4px' }}>Private by Default</p>
            <p style={{ fontSize:'13px', color:'var(--color-text-secondary)', lineHeight:1.5 }}>
              Your report is completely private. Only the system AI will process it for matching — no one else can browse or see it. Your identity remains hidden until a match is confirmed and you agree to connect.
            </p>
          </div>
        </motion.div>
        {/* Main Form Card */}
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.2 }}
          className="form-card"
          style={{
            background:'var(--color-card)',
            border:'1px solid var(--color-card-border)',
            borderRadius:'24px',
            padding:'36px',
            boxShadow:'0 8px 40px rgba(0,0,0,0.2)',
            position:'relative', overflow:'hidden',
          }}
        >
          {/* Emerald glow corner */}
          <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'160px', height:'160px', borderRadius:'50%', background:'rgba(16,185,129,0.08)', filter:'blur(40px)', pointerEvents:'none' }}/>
          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                style={{ padding:'11px 14px', borderRadius:'10px', background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.3)', color:'#FB7185', fontSize:'13px', fontWeight:600, marginBottom:'24px', display:'flex', alignItems:'center', gap:'8px' }}
              >
                <svg viewBox="0 0 24 24" fill="none" width="15" height="15"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          {!success ? (
            <form style={{ position:'relative', zIndex:1 }}>
              {/* Category */}
              <FieldWrap>
                <Label>Item Category</Label>
                <div style={{ position:'relative' }}>
                  <select
                    id="found-category-select"
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
              {/* Custom Category */}
              <AnimatePresence>
                {data.category === 'others' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                    <FieldWrap>
                      <Label>Specific Category</Label>
                      <input
                        type="text"
                        value={data.customCategory}
                        id="found-custom-category-input"
                        onChange={e => setData(d => ({ ...d, customCategory: e.target.value }))}
                        placeholder="e.g. Earbuds case, Textbooks"
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
                  id="found-item-name-input"
                  type="text"
                  value={data.itemName}
                  onChange={e => setData(d => ({ ...d, itemName: e.target.value }))}
                  onFocus={() => setFocusName(true)}
                  onBlur={() => setFocusName(false)}
                  placeholder="e.g. BoAt AirPods, Black Umbrella"
                  style={inputStyle(focusName)}
                />
              </FieldWrap>
              {/* Description */}
              <FieldWrap>
                <Label>Description <span style={{fontWeight:400, color:'var(--color-text-muted)'}}>(Optional)</span></Label>
                <textarea
                  id="found-description-textarea"
                  value={data.description}
                  onChange={e => setData(d => ({ ...d, description: e.target.value }))}
                  onFocus={() => setFocusDesc(true)}
                  onBlur={() => setFocusDesc(false)}
                  placeholder="Any details you think the owner would mention? (Keep it vague to ensure proper verification)"
                  rows={3}
                  style={{ ...inputStyle(focusDesc), resize:'vertical', lineHeight:1.65 }}
                />
              </FieldWrap>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'20px' }}>
                {/* Location */}
                <FieldWrap style={{ marginBottom: 0, flex:'1 1 200px' }}>
                  <Label>Where did you find it?</Label>
                  <div style={{ position:'relative' }}>
                    <select
                      id="found-location-select"
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
                {/* Date/Time */}
                <FieldWrap style={{ marginBottom: 0, flex:'1 1 200px' }}>
                  <Label>When did you find it?</Label>
                  <input
                    id="found-date-input"
                    type="datetime-local"
                    max={today}
                    value={data.dateFound}
                    onChange={e => setData(d => ({ ...d, dateFound: e.target.value }))}
                    onFocus={() => setFocusDate(true)}
                    onBlur={() => setFocusDate(false)}
                    style={{ ...inputStyle(focusDate), colorScheme:'dark' }}
                  />
                </FieldWrap>
              </div>
              {/* Custom Location Input */}
              <AnimatePresence>
                {data.location === 'Others (specify below)' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: '20px' }} exit={{ opacity: 0, height: 0, marginTop: 0 }} style={{ overflow: 'hidden' }}>
                    <FieldWrap style={{ marginBottom: 0, flex:'1 1 200px' }}>
                      <Label>Specific Location</Label>
                      <input
                        type="text"
                        value={data.customLocation}
                        id="found-custom-location-input"
                        onChange={e => setData(d => ({ ...d, customLocation: e.target.value }))}
                        placeholder="e.g. Near ATM, Seminar Hall 2"
                        style={inputStyle(false)}
                      />
                    </FieldWrap>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Photo Upload Area */}
              <div style={{ marginTop:'24px', marginBottom:'32px' }}>
                <Label>Upload Photo <span style={{fontWeight:400, color:'var(--color-text-muted)'}}>(Helps AI verification)</span></Label>
                {!data.photoUrl ? (
                  <motion.div
                    id="photo-upload-zone"
                    onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    style={{
                      height: '140px', display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      borderRadius: '16px', background: isDragging ? 'rgba(79,70,229,0.08)' : 'rgba(255,255,255,0.02)',
                      border: `2px dashed ${isDragging ? '#6366F1' : 'rgba(255,255,255,0.1)'}`,
                      transition: 'background .2s, border-color .2s',
                    }}
                  >
                    <input type="file" ref={fileInputRef} onChange={e => handlePhotoUpload(e.target.files[0])} accept="image/*" hidden />
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                      <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke={isDragging ? '#6366F1' : 'var(--color-text-muted)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: isDragging ? '#6366F1' : 'var(--color-text-secondary)', marginBottom: '4px' }}>
                      Click to upload or drag and drop
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>JPG, PNG, WEBP (Max 5MB)</p>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ width: '100%', height: '180px', background: `url(${data.photoUrl}) center/cover no-repeat` }} />
                    <button
                      type="button"
                      id="remove-photo-btn"
                      onClick={() => setData(d => ({ ...d, photo: null, photoUrl: '' }))}
                      style={{ position: 'absolute', top: '12px', right: '12px', width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><circle cx="12" cy="12" r="10" stroke="#34D399" strokeWidth="2"/><path d="M8 12l3 3 5-5" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span style={{ fontSize: '12px', color: '#fff', fontWeight: 600 }}>{data.photo.name}</span>
                    </div>
                  </motion.div>
                )}
                {/* Progress Bar */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginTop: '12px' }}>
                    <motion.div
                      animate={{ width: `${uploadProgress}%` }}
                      style={{ height: '100%', background: '#6366F1' }}
                    />
                  </div>
                )}
              </div>
              {/* Submit Button */}
              <motion.button
                id="submit-found-btn"
                type="button"
                onClick={handleSubmit}
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
                  {loading ? '🔄 Securing entry…' : '🚀 Submit Found Report'}
                </span>
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
              style={{ padding:'40px 20px', borderRadius:'16px', textAlign:'center', background:'rgba(16,185,129,0.05)', border:'1px solid rgba(16,185,129,0.2)' }}
            >
              <div style={{ width:'64px', height:'64px', margin:'0 auto 20px', borderRadius:'50%', background:'linear-gradient(135deg,#10B981,#34D399)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 24px rgba(16,185,129,0.4)', color:'#fff' }}>
                <svg viewBox="0 0 24 24" fill="none" width="32" height="32"><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <h2 style={{ fontSize:'24px', fontWeight:800, color:'#10B981', marginBottom:'8px' }}>Stored Privately!</h2>
              <p style={{ fontSize:'14px', color:'var(--color-text-secondary)', maxWidth:'400px', margin:'0 auto', lineHeight:1.6 }}>
                Thank you for being a responsible Warrior! Your report is secured. Our AI is actively scanning lost reports. We'll notify you via email and dashboard if a match is found.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
