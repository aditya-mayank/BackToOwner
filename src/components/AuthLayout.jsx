import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
/* ─── Mini Dashboard Mockup (Left Panel) ────────────────────────────── */
function DashboardMockup() {
  const items = [
    { id: 1, name: 'Student ID Card', loc: 'LHC Block A', time: '2h ago', status: 'matched', color: '#10B981' },
    { id: 2, name: 'Blue Water Bottle', loc: 'Canteen Area', time: '5h ago', status: 'searching', color: '#4F46E5' },
    { id: 3, name: 'Laptop Charger', loc: 'Library L2', time: '1d ago', status: 'pending', color: '#F59E0B' },
  ]
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      padding: '36px 32px',
      background: '#0A0A16',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Background orbs */}
      <div style={{ position:'absolute', top:'10%', left:'20%', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(79,70,229,0.12)', filter:'blur(70px)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:'20%', right:'10%', width:'250px', height:'250px', borderRadius:'50%', background:'rgba(16,185,129,0.08)', filter:'blur(60px)', pointerEvents:'none' }}/>
      {/* Mini Navbar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'32px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ width:'28px', height:'28px', borderRadius:'8px', background:'linear-gradient(135deg,#4F46E5,#6366F1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
              <path d="M16 6V5a3 3 0 00-3-3h-2a3 3 0 00-3 3v1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <rect x="2" y="6" width="20" height="15" rx="3" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <span style={{ fontSize:'13px', fontWeight:700, color:'#F1F5F9', letterSpacing:'-0.02em' }}>Back<span style={{color:'#4F46E5'}}>To</span>Owner</span>
        </div>
        <div style={{ display:'flex', gap:'6px' }}>
          {['#475569','#475569','#475569'].map((c,i) => (
            <div key={i} style={{ width:'6px', height:'6px', borderRadius:'50%', background:c }}/>
          ))}
        </div>
      </div>
      {/* Greeting */}
      <div style={{ marginBottom:'24px' }}>
        <p style={{ fontSize:'11px', color:'#475569', fontWeight:600, letterSpacing:'0.06em', marginBottom:'4px' }}>DASHBOARD</p>
        <h2 style={{ fontSize:'22px', fontWeight:800, color:'#F1F5F9', letterSpacing:'-0.03em' }}>Good morning, Warrior 👋</h2>
        <p style={{ fontSize:'13px', color:'#64748B', marginTop:'4px' }}>You have 1 new match today.</p>
      </div>
      {/* Match Alert */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          padding:'16px', borderRadius:'16px', marginBottom:'20px',
          background:'rgba(16,185,129,0.08)',
          border:'1px solid rgba(16,185,129,0.25)',
        }}
      >
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px' }}>
          <span style={{ fontSize:'11px', fontWeight:700, color:'#10B981', letterSpacing:'0.04em' }}>🎉 NEW MATCH</span>
          <span style={{ fontSize:'11px', padding:'2px 8px', borderRadius:'6px', background:'rgba(16,185,129,0.15)', color:'#10B981', fontWeight:600 }}>97% match</span>
        </div>
        <p style={{ fontSize:'14px', fontWeight:700, color:'#F1F5F9', marginBottom:'3px' }}>Student ID Card found!</p>
        <p style={{ fontSize:'12px', color:'#64748B' }}>📍 LHC Block A · 2 hours ago</p>
      </motion.div>
      {/* Items List */}
      <p style={{ fontSize:'11px', color:'#475569', fontWeight:700, letterSpacing:'0.06em', marginBottom:'12px' }}>RECENT REPORTS</p>
      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity:0, x:-20 }}
            animate={{ opacity:1, x:0 }}
            transition={{ delay: i * 0.12 + 0.3 }}
            style={{
              display:'flex', alignItems:'center', gap:'12px',
              padding:'13px 14px', borderRadius:'14px',
              background:'rgba(255,255,255,0.03)',
              border:'1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:`${item.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:item.color }}/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:'13px', fontWeight:600, color:'#E2E8F0', marginBottom:'2px', overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis' }}>{item.name}</p>
              <p style={{ fontSize:'11px', color:'#475569' }}>📍 {item.loc} · {item.time}</p>
            </div>
            <span style={{
              fontSize:'10px', fontWeight:700, padding:'3px 8px', borderRadius:'6px', flexShrink:0,
              background:`${item.color}18`, color:item.color, textTransform:'uppercase', letterSpacing:'0.04em',
            }}>{item.status}</span>
          </motion.div>
        ))}
      </div>
      {/* Mini Stats */}
      <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
        {[['500+','Returned'],['97%','AI Acc.'],['2hrs','Avg.']].map(([v,l]) => (
          <div key={l} style={{
            flex:1, padding:'12px', borderRadius:'12px', textAlign:'center',
            background:'rgba(79,70,229,0.08)', border:'1px solid rgba(79,70,229,0.15)',
          }}>
            <p style={{ fontSize:'16px', fontWeight:800, color:'#818CF8', letterSpacing:'-0.03em' }}>{v}</p>
            <p style={{ fontSize:'10px', color:'#475569', fontWeight:500 }}>{l}</p>
          </div>
        ))}
      </div>
      {/* Branding overlay */}
      <div style={{
        position:'absolute', bottom:'32px', left:'32px', right:'32px',
        display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
      }}>
        <div style={{ flex:1, height:'1px', background:'linear-gradient(to right, transparent, rgba(255,255,255,0.07))' }}/>
        <span style={{ fontSize:'11px', color:'#334155', fontWeight:500, whiteSpace:'nowrap' }}>NIT Warangal · Exclusive</span>
        <div style={{ flex:1, height:'1px', background:'linear-gradient(to left, transparent, rgba(255,255,255,0.07))' }}/>
      </div>
    </div>
  )
}
/* ─── Shared Auth Layout ────────────────────────────────────────────── */
export default function AuthLayout({ children }) {
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--color-bg)' }}>
      {/* Left Panel — Dashboard Mockup */}
      <div
        className="hidden lg:block"
        style={{ width:'52%', flexShrink:0, position:'sticky', top:0, height:'100vh', overflow:'hidden' }}
      >
        <DashboardMockup />
      </div>
      {/* Right Panel — Auth Form */}
      <div style={{
        flex:1,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:'40px 24px',
        background:'var(--color-bg)',
        position:'relative', overflow:'hidden',
      }}>
        {/* Background glow */}
        <div style={{ position:'absolute', top:'30%', left:'50%', transform:'translate(-50%,-50%)', width:'400px', height:'400px', borderRadius:'50%', background:'rgba(79,70,229,0.06)', filter:'blur(80px)', pointerEvents:'none' }}/>
        {/* Back to home */}
        <div style={{ position:'absolute', top:'24px', left:'24px' }}>
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', fontWeight:600, color:'var(--color-text-muted)', textDecoration:'none', transition:'color .2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#4F46E5'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
          >
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Back to home
          </Link>
        </div>
        {/* Form slot */}
        <div style={{ width:'100%', maxWidth:'440px', position:'relative', zIndex:1 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
