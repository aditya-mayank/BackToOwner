import React from 'react'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
export default function Profile() {
  const { user } = useAuth()
  return (
    <DashboardLayout>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--color-card)', padding: '32px', borderRadius: '20px', border: '1px solid var(--color-card-border)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '24px' }}>My Profile</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 800 }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{user?.name || 'Student'}</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>NIT Warangal</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Email</label>
            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', color: 'var(--color-text-primary)', border: '1px solid var(--color-card-border)' }}>
              {user?.email || 'student@nitw.ac.in'}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Role</label>
            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', color: 'var(--color-text-primary)', border: '1px solid var(--color-card-border)', textTransform: 'capitalize' }}>
              {user?.role || 'Student'}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
