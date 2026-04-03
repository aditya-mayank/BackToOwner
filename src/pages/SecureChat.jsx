import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '../components/DashboardLayout'
import { chatAPI } from '../api/endpoints.js'
import { useAuth } from '../context/AuthContext'

export default function SecureChat() {
  const { chatId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isResolved, setIsResolved] = useState(false)
  const [chatInfo, setChatInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (!chatId) return

    const fetchChat = async () => {
      try {
        // 1. Fetch messages
        const res = await chatAPI.getMessages(chatId)
        if (res.success) setMessages(res.messages)

        // 2. Fetch chat status from user chat list
        const chatsRes = await chatAPI.getUserChats()
        if (chatsRes.success) {
          const thisChat = chatsRes.chats.find(c => c._id === chatId)
          if (thisChat) {
            setChatInfo(thisChat)
            if (thisChat.status === 'closed') {
              setIsResolved(true)
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch chat:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchChat()
    const interval = setInterval(fetchChat, 5000)
    return () => clearInterval(interval)
  }, [chatId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!inputText.trim()) return
    
    const textToSend = inputText
    setInputText('')
    
    try {
      const res = await chatAPI.sendMessage(chatId, textToSend)
      if (res.success) {
        setMessages(prev => [...prev, res.message])
      }
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  const handleResolve = async () => {
    if (!window.confirm('Mark this item as returned and close the chat?')) return
    try {
      const res = await chatAPI.closeChat(chatId)
      if (res.success) {
        setIsResolved(true)
        setTimeout(() => navigate('/dashboard'), 3000)
      }
    } catch (err) {
      console.error('Failed to resolve chat:', err)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (loading) {
    return <DashboardLayout><div style={{ textAlign:'center', paddingTop:'100px', color:'var(--color-text-muted)' }}>Loading chat...</div></DashboardLayout>
  }

  // Removed the global overlay. Chat remains visible underneath when resolved.

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
            <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 12px', background: isResolved ? 'rgba(16,185,129,0.1)' : 'rgba(79,70,229,0.1)', borderRadius:'12px', border: isResolved ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(79,70,229,0.2)' }}>
              <div style={{ width:'6px', height:'6px', borderRadius:'50%', background: isResolved ? '#10B981' : '#818CF8' }} />
              <span style={{ fontSize:'12px', color: isResolved ? '#10B981' : '#818CF8', fontWeight:700 }}>{isResolved ? 'Resolved' : 'Active'}</span>
            </div>
          </div>
          <div style={{ padding:'10px 20px', background:'rgba(245,158,11,0.1)', borderTop:'1px solid rgba(245,158,11,0.2)', borderBottom:'1px solid rgba(245,158,11,0.2)', display:'flex', gap:'12px', alignItems:'flex-start' }}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16" color="#F59E0B" style={{ flexShrink:0, marginTop:'2px' }}><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <p style={{ fontSize:'12px', color:'#F59E0B', fontWeight:600, lineHeight:1.4 }}>
              This chat is opened between Match participants. Avoid sharing outside contact info.
            </p>
          </div>
        </div>
        {/* Messages Area */}
        <div style={{ flex:1, overflowY:'auto', padding:'24px', display:'flex', flexDirection:'column', gap:'16px' }}>
          {messages.map((msg, i) => {
            const isMe = msg.senderId === user?._id || msg.senderId === user?.id
            return (
              <motion.div
                key={i}
                initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }}
                style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth:'70%' }}
              >
                <div style={{
                  padding:'10px 14px', borderRadius:'14px',
                  background: isMe ? 'linear-gradient(135deg,#4F46E5,#6366F1)' : 'rgba(255,255,255,0.05)',
                  color:'#fff', border: isMe ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  fontSize:'14px', borderRadius: isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px'
                }}>
                  {msg.text}
                </div>
                <p style={{ fontSize:'10px', color:'var(--color-text-muted)', textAlign: isMe ? 'right' : 'left', marginTop:'4px' }}>
                  {new Date(msg.sentAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                </p>
              </motion.div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
        {/* Input area */}
        {!isResolved ? (
          <div style={{ padding:'20px', background:'var(--color-card)', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px', padding:'10px 16px', background:'rgba(99,102,241,0.08)', borderRadius:'12px' }}>
               <span style={{ fontSize:'13px', color:'#818CF8', fontWeight:600 }}>Item returned?</span>
               <button onClick={handleResolve} style={{ padding:'6px 12px', borderRadius:'8px', background:'#4F46E5', color:'#fff', border:'none', fontSize:'12px', fontWeight:700, cursor:'pointer' }}>Mark as Returned</button>
            </div>
            <form onSubmit={handleSend} style={{ display:'flex', gap:'12px' }}>
               <input 
                id="chat-input"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message securely..."
                style={{ flex:1, padding:'12px 16px', borderRadius:'12px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)', color:'#fff', outline:'none' }}
               />
               <button type="submit" disabled={!inputText.trim()} style={{ width:'45px', height:'45px', borderRadius:'12px', background: inputText.trim() ? '#4F46E5' : 'rgba(255,255,255,0.05)', border:'none', color:'#fff', cursor: inputText.trim() ? 'pointer' : 'default', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg viewBox="0 0 24 24" fill="none" width="20" height="20" style={{ transform:'rotate(45deg) translate(-1px, 1px)' }}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
               </button>
            </form>
          </div>
        ) : (
          <div style={{ padding:'20px', background:'var(--color-card)', borderTop:'1px solid rgba(255,255,255,0.05)', textAlign:'center' }}>
             <p style={{ color:'var(--color-text-secondary)', fontSize:'14px', fontWeight:600 }}>This conversation has been resolved. No further messages can be sent.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
