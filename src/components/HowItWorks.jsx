import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
/* ─── Step Data ──────────────────────────────────────────────────────── */
const STEPS = [
  {
    id: 1,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
        <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
      </svg>
    ),
    colorFrom: '#4F46E5',
    colorTo:   '#6366F1',
    glowColor: 'rgba(79,70,229,0.25)',
    borderColor: 'rgba(79,70,229,0.3)',
    bgColor: 'rgba(79,70,229,0.08)',
    label: 'Step 1',
    title: 'Report Found Item',
    desc: 'A student finds an item and submits a private report with location and photo.',
  },
  {
    id: 2,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
        <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    colorFrom: '#7C3AED',
    colorTo:   '#8B5CF6',
    glowColor: 'rgba(124,58,237,0.25)',
    borderColor: 'rgba(124,58,237,0.3)',
    bgColor: 'rgba(124,58,237,0.08)',
    label: 'Step 2',
    title: 'Report Lost Item',
    desc: 'The owner files a lost report. Our NLP engine immediately starts matching.',
  },
  {
    id: 3,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
        <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
    colorFrom: '#10B981',
    colorTo:   '#34D399',
    glowColor: 'rgba(16,185,129,0.25)',
    borderColor: 'rgba(16,185,129,0.3)',
    bgColor: 'rgba(16,185,129,0.08)',
    label: 'Step 3',
    title: 'AI Matching',
    desc: 'Our algorithm scores matches across category, name, description, and location. 70%+ triggers a notification.',
  },
  {
    id: 4,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="26" height="26">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    colorFrom: '#F43F5E',
    colorTo:   '#FB7185',
    glowColor: 'rgba(244,63,94,0.25)',
    borderColor: 'rgba(244,63,94,0.3)',
    bgColor: 'rgba(244,63,94,0.08)',
    label: 'Step 4',
    title: 'Secure Chat & Return',
    desc: 'Matched students connect via a private chatbox to arrange return. No contact info exposed.',
  },
]
/* ─── Connector Line (desktop) ───────────────────────────────────────── */
function ConnectorLine({ isInView, delay }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, width: '48px', marginTop: '-28px' }}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.5, delay, ease: 'easeInOut' }}
        style={{
          height: '2px',
          width: '100%',
          background: 'linear-gradient(90deg, rgba(79,70,229,0.7), rgba(16,185,129,0.7))',
          transformOrigin: 'left',
          borderRadius: '2px',
          boxShadow: '0 0 8px rgba(79,70,229,0.4)',
        }}
      />
    </div>
  )
}
/* ─── Step Card ──────────────────────────────────────────────────────── */
function StepCard({ step, index, isInView }) {
  const cardVariants = {
    hidden:  { opacity: 0, y: 40 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.65, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] },
    },
  }
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      style={{
        flex: 1,
        minWidth: '220px',
        position: 'relative',
        background: 'var(--color-card)',
        border: `1px solid ${step.borderColor}`,
        borderRadius: '24px',
        padding: '28px 24px 28px',
        cursor: 'default',
        backdropFilter: 'blur(12px)',
        boxShadow: `0 4px 32px ${step.glowColor}, 0 1px 0 rgba(255,255,255,0.05) inset`,
        overflow: 'hidden',
      }}
    >
      {/* Background glow blob */}
      <div style={{
        position: 'absolute', top: '-30px', right: '-30px',
        width: '120px', height: '120px', borderRadius: '50%',
        background: step.glowColor, filter: 'blur(30px)',
        pointerEvents: 'none',
      }} />
      {/* Step number */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: '3px 10px', borderRadius: '8px', marginBottom: '18px',
        background: step.bgColor, border: `1px solid ${step.borderColor}`,
        fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em',
        color: step.colorFrom, textTransform: 'uppercase',
      }}>
        {step.label}
      </div>
      {/* Icon */}
      <div style={{
        width: '56px', height: '56px', borderRadius: '16px', marginBottom: '18px',
        background: `linear-gradient(135deg, ${step.colorFrom}, ${step.colorTo})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff',
        boxShadow: `0 8px 24px ${step.glowColor}`,
      }}>
        {step.icon}
      </div>
      {/* Title */}
      <h3 style={{
        fontSize: '17px', fontWeight: 700, letterSpacing: '-0.02em',
        color: 'var(--color-text-primary)', marginBottom: '10px',
      }}>
        {step.title}
      </h3>
      {/* Description */}
      <p style={{
        fontSize: '14px', lineHeight: 1.7,
        color: 'var(--color-text-secondary)',
      }}>
        {step.desc}
      </p>
      {/* Bottom accent line */}
      <div style={{
        position: 'absolute', bottom: 0, left: '24px', right: '24px', height: '2px',
        background: `linear-gradient(90deg, ${step.colorFrom}, transparent)`,
        borderRadius: '2px',
      }} />
    </motion.div>
  )
}
/* ─── Main Section ───────────────────────────────────────────────────── */
export default function HowItWorks() {
  const sectionRef = useRef(null)
  const isInView   = useInView(sectionRef, { once: true, margin: '-80px' })
  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      style={{
        padding: '100px 0 80px',
        background: 'var(--color-bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle top border glow */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(79,70,229,0.4), rgba(16,185,129,0.4), transparent)',
      }} />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 16px', borderRadius: '99px', marginBottom: '16px',
            background: 'rgba(79,70,229,0.1)',
            border: '1px solid rgba(79,70,229,0.25)',
            color: '#818CF8', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em',
          }}>
            ⚡ HOW IT WORKS
          </span>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 46px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--color-text-primary)',
            marginBottom: '14px',
          }}>
            From lost to{' '}
            <span style={{
              background: 'linear-gradient(135deg, #4F46E5, #10B981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              found in 4 steps
            </span>
          </h2>
          <p style={{
            fontSize: '17px', color: 'var(--color-text-secondary)',
            maxWidth: '520px', margin: '0 auto', lineHeight: 1.7,
          }}>
            A seamless, privacy-first pipeline powered by AI — built exclusively for NIT Warangal.
          </p>
        </motion.div>
        {/* Steps Row — desktop horizontal, mobile vertical */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '0',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}>
          {STEPS.map((step, i) => (
            <React.Fragment key={step.id}>
              <StepCard step={step} index={i} isInView={isInView} />
              {i < STEPS.length - 1 && (
                <>
                  {/* Desktop connector */}
                  <div className="hidden lg:flex" style={{ alignItems: 'center', paddingTop: '60px', width: '48px', flexShrink: 0 }}>
                    <ConnectorLine isInView={isInView} delay={i * 0.15 + 0.4} />
                  </div>
                  {/* Mobile connector (vertical dot) */}
                  <div className="flex lg:hidden" style={{
                    width: '100%', display: 'flex', justifyContent: 'center', padding: '8px 0',
                  }}>
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.15 + 0.35 }}
                      style={{
                        width: '2px', height: '28px',
                        background: 'linear-gradient(180deg, rgba(79,70,229,0.7), rgba(16,185,129,0.4))',
                        transformOrigin: 'top', borderRadius: '2px',
                      }}
                    />
                  </div>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
