import React from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '../components/DashboardLayout'

function FeatureCard({ icon, title, desc, delay, color }) {
  return (
    <motion.div
      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay, duration:0.5 }}
      whileHover={{ y:-5, boxShadow:'0 15px 45px rgba(0,0,0,0.3)' }}
      style={{
        background:'var(--color-card)', border:'1px solid var(--color-card-border)', borderRadius:'28px', padding:'32px',
        display:'flex', flexDirection:'column', gap:'16px', position:'relative', overflow:'hidden'
      }}
    >
      <div style={{ position:'absolute', top:'-20px', right:'-20px', width:'100px', height:'100px', borderRadius:'50%', background:`${color}10`, filter:'blur(30px)' }} />
      <div style={{ fontSize:'36px' }}>{icon}</div>
      <h3 style={{ fontSize:'20px', fontWeight:800, color:'var(--color-text-primary)', letterSpacing:'-0.02em' }}>{title}</h3>
      <p style={{ fontSize:'14.5px', lineHeight:1.7, color:'var(--color-text-secondary)' }}>{desc}</p>
    </motion.div>
  )
}

function PathStep({ step, title, desc, color }) {
  return (
    <div style={{ display:'flex', gap:'20px', padding:'24px', background:'rgba(255,255,255,0.02)', borderRadius:'20px', border:`1px solid ${color}15` }}>
      <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:`${color}20`, border:`1px solid ${color}30`, color:color, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'14px', flexShrink:0 }}>{step}</div>
      <div>
        <h4 style={{ fontSize:'16px', fontWeight:700, color:'var(--color-text-primary)' }}>{title}</h4>
        <p style={{ fontSize:'14px', color:'var(--color-text-secondary)', marginTop:'4px', lineHeight:1.5 }}>{desc}</p>
      </div>
    </div>
  )
}

export default function About() {
  return (
    <DashboardLayout>
      <div style={{ maxWidth:'1000px', margin:'0 auto', paddingBottom:'80px' }}>
        
        {/* 🔥 Header and Vision Section */}
        <motion.div 
          initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
          style={{ 
            textAlign:'center', marginBottom:'60px', padding:'80px 40px', borderRadius:'40px',
            background:'linear-gradient(135deg, rgba(79,70,229,0.15), rgba(16,185,129,0.08))',
            border:'1px solid rgba(255,255,255,0.05)', position:'relative', overflow:'hidden'
          }}
        >
          <motion.div animate={{ scale:[1,1.3,1], opacity:[0.2,0.4,0.2] }} transition={{ duration:10, repeat:Infinity }} 
            style={{ position:'absolute', top:'-100px', left:'-100px', width:'350px', height:'350px', borderRadius:'50%', background:'rgba(79,70,229,0.3)', filter:'blur(80px)' }} />
          
          <div style={{ position:'relative', zIndex:1 }}>
            <span style={{ fontSize:'12px', fontWeight:800, letterSpacing:'0.1em', background:'rgba(79,70,229,0.15)', color:'#818CF8', padding:'6px 16px', borderRadius:'100px', textTransform:'uppercase' }}>Our Mission</span>
            <h1 style={{ fontSize:'clamp(36px, 6vw, 56px)', fontWeight:900, letterSpacing:'-0.04em', color:'var(--color-text-primary)', margin:'20px 0' }}>
              Reconnecting You <br/> With Your Possessions
            </h1>
            <p style={{ fontSize:'19px', color:'var(--color-text-secondary)', maxWidth:'680px', margin:'0 auto', lineHeight:1.7 }}>
              BackToOwner is more than just a matching tool. We are building a trusted, community-driven ecosystem to ensure that <strong>no item is ever truly lost</strong> at NIT Warangal.
            </p>
          </div>
        </motion.div>

        {/* 🧠 Our Vision */}
        <div style={{ textAlign:'center', marginBottom:'100px' }}>
          <h2 style={{ fontSize:'28px', fontWeight:800, color:'var(--color-text-primary)', marginBottom:'20px' }}>Project Vision 🚀</h2>
          <div style={{ maxWidth:'720px', margin:'0 auto', fontSize:'16px', color:'var(--color-text-secondary)', lineHeight:1.8 }}>
            Our vision is to transform campus life by eliminating the stress of lost items. By integrating autonomous AI analysis, instant mobile notifications, and a transparent live feed, we aim to make recovery as seamless as reporting. We envision a campus where honesty is rewarded and finding an item is the start of a quick resolution.
          </div>
        </div>

        {/* ⚡ Dual Path Guide: Lost & Found */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(400px, 1fr))', gap:'30px', marginBottom:'100px' }}>
          {/* Lost Section */}
          <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px' }}>
              <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:'rgba(244,63,94,0.12)', border:'1px solid rgba(244,63,94,0.2)', color:'#F43F5E', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px' }}>🔎</div>
              <h3 style={{ fontSize:'22px', fontWeight:800, color:'var(--color-text-primary)' }}>Reporting a Lost Item</h3>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              <PathStep step="1" color="#F43F5E" title="Detail the Context" desc="Provide item name, category, and where you last saw it at NITW. Descriptive names help our AI score matches higher." />
              <PathStep step="2" color="#F59E0B" title="Privacy Level" desc="Set as Public to show on Campus Live Feed, or Private to keep the search between you and potential finders." />
              <PathStep step="3" color="#10B981" title="Await AI Matches" desc="Our matching engine runs 24/7. When a found report matches yours above 70%, you'll get an alert with a 'Match Card'." />
            </div>
          </motion.div>

          {/* Found Section */}
          <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px' }}>
              <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.2)', color:'#10B981', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px' }}>🤝</div>
              <h3 style={{ fontSize:'22px', fontWeight:800, color:'var(--color-text-primary)' }}>Reporting Found Items</h3>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              <PathStep step="1" color="#10B981" title="Honest Reporting" desc="Describe the item but skip a few identifying details (like a specific sticker or serial number) for verification late." />
              <PathStep step="2" color="#4F46E5" title="Location Precision" desc="Tell us exactly where you found it—Library, Hostel-M, or KV Gate. This narrows down the pool of potential owners." />
              <PathStep step="3" color="#7C3AED" title="Verify via Chat" desc="When a match is found, use our secure chat to ask the 'owner' for a specific detail only they would know." />
            </div>
          </motion.div>
        </div>

        {/* 🤖 Our Tech Pillars */}
        <div style={{ marginBottom:'80px' }}>
          <h2 style={{ fontSize:'24px', fontWeight:800, color:'var(--color-text-primary)', marginBottom:'32px', textAlign:'center' }}>The Technology Inside</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'20px' }}>
            <FeatureCard delay={0.1} color="#4F46E5" icon="🎯" title="Fuzzy Matching" desc="We use sophisticated string and semantic similarity algorithms to understand that 'blue shirt' and 'navy polo' describe the same item." />
            <FeatureCard delay={0.2} color="#10B981" icon="🔔" title="Event-Driven Feed" desc="Every report triggers a real-time global broadcast. Live feeds update instantly via our active monitoring system across the campus." />
            <FeatureCard delay={0.3} color="#F59E0B" icon="💬" title="Secure Handovers" desc="Matches happen privately. We provide the chat channel and the match logic—the community provides the trust. No more public phone numbers." />
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign:'center', color:'var(--color-text-muted)', fontSize:'12px', marginTop:'60px', opacity:0.6 }}>
          BackToOwner © 2024 · Developing Trust at NIT Warangal
        </p>
      </div>
    </DashboardLayout>
  )
}
