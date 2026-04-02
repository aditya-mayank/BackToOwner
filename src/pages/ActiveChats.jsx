import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '../components/DashboardLayout'
import { chatAPI } from '../api/endpoints.js'
import { useAuth } from '../context/AuthContext'

function ChatCard({ chat, index, me }) {
  const navigate = useNavigate()
  const otherParticipant = chat.participants.find(p => p._id !== me._id) || { name: 'Student' }
  const lastMsg = chat.messages?.[chat.messages.length - 1]
  const isClosed = chat.status === 'closed'

  return (
    <motion.div
      initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: index * 0.05 }}
      onClick={() => navigate(`/chat/${chat._id}`)}
      style={{
        background: 'var(--color-card)', border: '1px solid var(--color-card-border)',
        borderRadius: '20px', padding: '20px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '16px', transition: 'all .2s',
        position: 'relative', overflow: 'hidden',
        opacity: isClosed ? 0.7 : 1
      }}
      whileHover={{ y: -4, borderColor: isClosed ? 'var(--color-card-border)' : '#4F46E5', boxShadow: '0 12px 32px rgba(0,0,0,0.2)' }}
    >
      <div style={{ position:'absolute', top:0, left:0, width:'4px', height:'100%', background: isClosed ? 'var(--color-text-muted)' : '#4F46E5' }}/>

      <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: isClosed ? 'rgba(255,255,255,0.05)' : 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: isClosed ? 'var(--color-text-muted)' : '#818CF8', flexShrink: 0 }}>
        {otherParticipant.name.charAt(0).toUpperCase()}
      </div>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {otherParticipant.name}
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            {new Date(chat.updatedAt).toLocaleDateString()}
          </span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '6px' }}>
          {isClosed ? 'Conversation closed (Item Returned)' : (lastMsg ? lastMsg.text : `Connect for ${chat.lostItemId?.title || 'item'}`)}
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            {chat.lostItemId?.category || 'General'}
          </span>
          <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: isClosed ? 'rgba(16,185,129,0.1)' : 'rgba(79,70,229,0.1)', color: isClosed ? '#10B981' : '#818CF8', textTransform: 'uppercase' }}>
            {chat.status}
          </span>
        </div>
      </div>
      
      <svg viewBox="0 0 24 24" fill="none" width="18" height="18" style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </motion.div>
  )
}

export default function ActiveChats() {
  const { user } = useAuth()
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetchChats = async () => {
      try {
        const res = await chatAPI.getUserChats()
        if (res.success) setChats(res.chats)
      } catch (err) {
        console.error('Failed to fetch chats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchChats()
  }, [user])

  const activeChats = chats.filter(c => c.status === 'active')
  const resolvedChats = chats.filter(c => c.status === 'closed')

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 32px)', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>
            Matches & Conversations
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Coordinate item returns directly and securely.
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: '94px', borderRadius: '20px', background: 'var(--color-card)', opacity: 0.3, border: '1px solid var(--color-card-border)' }} />
            ))}
          </div>
        ) : chats.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {activeChats.length > 0 && (
              <div>
                <h2 style={{ fontSize:'16px', fontWeight:700, color:'#818CF8', marginBottom:'16px', textTransform:'uppercase', letterSpacing:'0.05em', display:'flex', alignItems:'center', gap:'8px' }}>
                  <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#818CF8' }}/> Active Matches
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activeChats.map((chat, i) => (
                    <ChatCard key={chat._id} chat={chat} index={i} me={user} />
                  ))}
                </div>
              </div>
            )}

            {resolvedChats.length > 0 && (
              <div>
                <h2 style={{ fontSize:'16px', fontWeight:700, color:'var(--color-text-muted)', marginBottom:'16px', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                  Resolved History
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {resolvedChats.map((chat, i) => (
                    <ChatCard key={chat._id} chat={chat} index={i} me={user} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ padding: '100px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--color-card)', borderRadius: '24px', border: '1px solid var(--color-card-border)' }}
          >
             <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <svg viewBox="0 0 24 24" fill="none" width="40" height="40" color="#818CF8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>No active chats yet</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '320px', margin: '8px 0 24px', lineHeight: 1.6 }}>
              Once our AI matches your lost items with found reports, your conversations will appear here.
            </p>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
