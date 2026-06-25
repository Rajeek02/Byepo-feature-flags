import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
export default function Signup() {
 const [orgs, setOrgs] = useState([]);
 const [form, setForm] = useState({ email: '', password: '', organizationId: '' });
 const [showPassword, setShowPassword] = useState(false);
 const [msg, setMsg] = useState('');
 const navigate = useNavigate();
 useEffect(() => {
   API.get('/org-admin/organizations').then(r => setOrgs(r.data));
 }, []);
 const handleSignup = async () => {
   try {
     await API.post('/org-admin/signup', form);
     setMsg('Signup successful! Please login.');
     setTimeout(() => navigate('/'), 1500);
   } catch (err) {
     setMsg(err.response?.data?.message || 'Error');
   }
 };
 const styles = {
   page: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '48px 16px', background: 'linear-gradient(180deg, #eef2ff 0%, #ffffff 100%)' },
   card: { width: '100%', maxWidth: 500, background: '#ffffff', borderRadius: 28, padding: '36px 32px', boxShadow: '0 28px 90px rgba(15, 23, 42, 0.12)', border: '1px solid rgba(15, 23, 42, 0.08)' },
   title: { margin: 0, fontSize: 32, color: '#111827' },
   subtitle: { margin: '12px 0 24px', color: '#6b7280', lineHeight: 1.7 },
   input: { width: '100%', padding: '14px 16px', borderRadius: 16, border: '1px solid #d1d5db', background: '#f8fafc', color: '#111827', fontSize: 15, marginBottom: 16, boxSizing: 'border-box' },
   passwordWrapper: { position: 'relative', marginBottom: 16 },
   toggle: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', color: '#6b7280', cursor: 'pointer', zIndex: 2, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 },
   submit: { width: '100%', padding: '14px 16px', background: '#f59e0b', border: 'none', borderRadius: 16, color: '#111827', fontWeight: 700, cursor: 'pointer' },
   message: { marginBottom: 16, color: '#0f766e' },
   footer: { marginTop: 18, color: '#6b7280', fontSize: 14 }
 };
 return (
   <div style={styles.page}>
     <div style={styles.card}>
       <h2 style={styles.title}>Admin Signup</h2>
       <p style={styles.subtitle}>Create your admin account and connect to an organization.</p>
       {msg && <p style={styles.message}>{msg}</p>}
       <input placeholder='Email' value={form.email}
         onChange={e => setForm({ ...form, email: e.target.value })}
         style={styles.input} />
       <div style={styles.passwordWrapper}>
         <input type={showPassword ? 'text' : 'password'} placeholder='Password' value={form.password}
           onChange={e => setForm({ ...form, password: e.target.value })}
           style={{ ...styles.input, paddingRight: 56 }} />
         <button type='button' onClick={() => setShowPassword(prev => !prev)} style={styles.toggle} aria-label={showPassword ? 'Hide password' : 'Show password'}>
           {showPassword ? (
             <svg viewBox='0 0 24 24' width='20' height='20' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
               <path d='M17.94 17.94A10.06 10.06 0 0 1 12 20c-5.33 0-9.8-3.24-11.45-7.74a1 1 0 0 1 0-.52' />
               <path d='M1 1l22 22' />
               <path d='M9.88 9.88a3 3 0 0 0 4.24 4.24' />
               <path d='M14.12 14.12A3 3 0 0 1 9.88 9.88' />
               <path d='M14.47 9.53A3 3 0 0 0 9.53 14.47' />
             </svg>
           ) : (
             <svg viewBox='0 0 24 24' width='20' height='20' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
               <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
               <circle cx='12' cy='12' r='3' />
             </svg>
           )}
         </button>
       </div>
       <select value={form.organizationId}
         onChange={e => setForm({ ...form, organizationId: e.target.value })}
         style={styles.input}>
         <option value=''>Select Organization</option>
         {orgs.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
       </select>
       <button onClick={handleSignup} style={styles.submit}>Sign Up</button>
       <p style={styles.footer}>Already have an account? <a href='/'>Login</a></p>
     </div>
   </div>
 );
}