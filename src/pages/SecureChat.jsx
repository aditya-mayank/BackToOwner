import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '../components/DashboardLayout'
const INITIAL_MESSAGES = [
  { id: 1, text: 'Hi, I think you found my Grey Nike Backpack!', sender: 'me', time: '10:00 AM' },
  { id: 2, text: 'Hey! Yes, I found one in the library. Does it have a blue keychain on the zipper?', sender: 'other', time: '10:05 AM' },
  { id: 3, text: 'Yes! That is definitely mine. Thank you so much!', sender: 'me', time: '10:06 AM' },
  { id: 4, text: 'Awesome. I dropped it off at the Main Security Desk at the front gate just now.', sender: 'other', time: '10:10 AM' },
]
export default function SecureChat() {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [inputText, setInputText] = useState('')
  const [isResolved, setIsResolved] = useState(false)
  const messagesEndRef = useRef(null)
  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  const handleSend = (e) => {
    e?.preventDefault()
    if (!inputText.trim()) return
    const newMsg = {
      id: Date.now(),
      text: inputText,
      sender: 'me',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, newMsg])
    setInputText('')
    // Simulate auto-reply for demo purposes
    if (!isResolved) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: 'Got it. Let me know when you pick it up so we can mark this returned!',
          sender: 'other',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }])
      }, 1500)
    }
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  return (
    <DashboardLayout>
      <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 120px)', minHeight:'500px', maxWidth:'800px', margin:'0 auto', background:'var(--color-bg)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:'20px', overflow:'hidden', boxShadow:'0 16px 40px rgba(0,0,0,0.2)' }}>
        {/* Top Bar */}
        <div style={{ background:'var(--color-card)', borderBottom:'1px solid rgba(255,255,255,0.05)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
              <button onClick={() => navigate(-1)} style={{ background:'none', border:'none', color:'var(--color-text-muted)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', width:'32px', height:'32px', borderRadius:'8px', transition:'background .2s' }} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseLeave={e=>e.currentTarget.style.background='none'}>
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:'rgba(79,70,229,0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'#818CF8' }}>
                  <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <h2 style={{ fontSize:'16px', fontWeight:700, color:'var(--color-text-primary)' }}>Secure Match Chat</h2>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <svg viewBox="0 0 24 24" fill="none" width="12" height="12" color="#10B981"><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    <span style={{ fontSize:'12px', color:'#10B981', fontWeight:600 }}>Encrypted & Private</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Status Indicator */}
            <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 12px', background:'rgba(16,185,129,0.1)', borderRadius:'12px', border:'1px solid rgba(16,185,129,0.2)' }}>
              <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#10B981' }} />
              <span style={{ fontSize:'12px', color:'#10B981', fontWeight:700 }}>Active</span>
            </div>
          </div>
          {/* Amber Warning Strip */}
          <div style={{ padding:'10px 20px', background:'rgba(245,158,11,0.1)', borderTop:'1px solid rgba(245,158,11,0.2)', borderBottom:'1px solid rgba(245,158,11,0.2)', display:'flex', gap:'12px', alignItems:'flex-start' }}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16" color="#F59E0B" style={{ flexShrink:0, marginTop:'2px' }}><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <p style={{ fontSize:'12px', color:'#F59E0B', fontWeight:600, lineHeight:1.4 }}>
              This chat was opened because of a <strong style={{color:'#fff'}}>85% item match</strong>. Do not share personal contact details. Chat closes automatically when item is marked returned.
            </p>
          </div>
        </div>
        {/* Chat Messages Area */}
        <div style={{ flex:1, overflowY:'auto', padding:'24px', display:'flex', flexDirection:'column', gap:'20px' }}>
          <AnimatePresence>
            {messages.map((msg) => {
              const isMe = msg.sender === 'me'
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity:0, y:10, scale:0.95 }}
                  animate={{ opacity:1, y:0, scale:1 }}
                  transition={{ duration: 0.2 }}
                  style={{ display:'flex', gap:'12px', alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth:'75%' }}
                >
                  {!isMe && (
                    <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'var(--color-text-secondary)', fontSize:'14px', fontWeight:700 }}>
                      F
                    </div>
                  )}
                  <div style={{ display:'flex', flexDirection:'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      padding:'12px 16px', borderRadius:'16px',
                      background: isMe ? 'linear-gradient(135deg,#4F46E5,#6366F1)' : 'rgba(255,255,255,0.05)',
                      color: isMe ? '#fff' : 'var(--color-text-primary)',
                      borderTopRightRadius: isMe ? '4px' : '16px',
                      borderTopLeftRadius: !isMe ? '4px' : '16px',
                      fontSize:'14px', lineHeight:1.5, boxShadow:'0 4px 12px rgba(0,0,0,0.1)',
                      border: isMe ? 'none' : '1px solid rgba(255,255,255,0.05)'
                    }}>
                      {msg.text}
                    </div>
                    <span style={{ fontSize:'11px', color:'var(--color-text-muted)', marginTop:'6px', margin: isMe ? '0 4px 0 0' : '0 0 0 4px' }}>
                      {msg.time}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        {/* Resolved Banner / Form Banner */}
        {isResolved ? (
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ padding:'24px', background:'rgba(16,185,129,0.08)', borderTop:'1px solid rgba(16,185,129,0.2)', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:'12px' }}>
            <div style={{ width:'48px', height:'48px', borderRadius:'50%', background:'#10B981', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', boxShadow:'0 0 20px rgba(16,185,129,0.4)' }}>
              <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <h3 style={{ fontSize:'18px', fontWeight:800, color:'#10B981', marginBottom:'4px' }}>Wonderful! Item marked as returned.</h3>
              <p style={{ fontSize:'13px', color:'var(--color-text-secondary)' }}>This chat will close in 24 hours. Thank you for using BackToOwner.</p>
            </div>
          </motion.div>
        ) : (
          <div style={{ background:'var(--color-card)', borderTop:'1px solid rgba(255,255,255,0.05)', padding:'16px 20px', display:'flex', flexDirection:'column', gap:'16px' }}>
            {/* Mark Resolved Banner */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:'12px' }}>
              <span style={{ fontSize:'13px', fontWeight:600, color:'#818CF8' }}>Got your item back?</span>
              <button id="mark-resolved-btn" onClick={() => setIsResolved(true)} style={{ padding:'6px 12px', borderRadius:'8px', border:'none', background:'#4F46E5', color:'#fff', fontSize:'12px', fontWeight:700, cursor:'pointer' }}>
                Both parties: Mark as Returned
              </button>
            </div>
            {/* Input Area */}
            <form onSubmit={handleSend} style={{ display:'flex', alignItems:'flex-end', gap:'12px' }}>
              <button type="button" style={{ width:'44px', height:'44px', borderRadius:'12px', background:'rgba(255,255,255,0.05)', border:'none', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--color-text-secondary)', cursor:'pointer', flexShrink:0 }}>
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <textarea
                id="chat-input"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                style={{
                  flex:1, padding:'12px 16px', borderRadius:'12px', background:'rgba(255,255,255,0.03)',
                  border:'1px solid rgba(255,255,255,0.1)', color:'var(--color-text-primary)',
                  fontSize:'14px', outline:'none', resize:'none', fontFamily:'var(--font)',
                  maxHeight:'120px'
                }}
              />
              <button
                id="chat-send-btn"
                type="submit"
                disabled={!inputText.trim()}
                style={{
                  width:'44px', height:'44px', borderRadius:'12px', border:'none',
                  background: inputText.trim() ? '#4F46E5' : 'rgba(255,255,255,0.05)',
                  color: inputText.trim() ? '#fff' : 'rgba(255,255,255,0.2)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  cursor: inputText.trim() ? 'pointer' : 'not-allowed', flexShrink:0,
                  transition:'background .2s, color .2s'
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18" style={{ transform:'translate(1px, -1px)' }}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
