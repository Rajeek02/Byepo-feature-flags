import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
export default function Dashboard({ onLogout }) {
 const [flags, setFlags] = useState([]);
 const [key, setKey] = useState('');
 const [msg, setMsg] = useState('');
 const navigate = useNavigate();
const fetchFlags = useCallback(async () => {
   try {
     const res = await API.get('/org-admin/flags');
     setFlags(res.data);
   } catch (err) {
     if (err.response?.status === 401) {
       localStorage.removeItem('adminToken');
       onLogout?.();
       navigate('/', { replace: true });
     }
     setMsg(err.response?.data?.message || 'Unable to load flags');
   }
}, [navigate, onLogout]);
useEffect(() => { fetchFlags(); }, [fetchFlags]);
 const createFlag = async () => {
   if (!key.trim()) return;
   try {
     await API.post('/org-admin/flags', { feature_key: key, enabled: false });
     setKey('');
     fetchFlags();
     setMsg('Flag created!');
   } catch (err) {
     setMsg(err.response?.data?.message || 'Error creating flag');
   }
 };
 const toggleFlag = async (id, enabled) => {
   try {
     await API.put(`/org-admin/flags/${id}`, { enabled: !enabled });
     fetchFlags();
   } catch (err) {
     setMsg(err.response?.data?.message || 'Error updating flag');
   }
 };
 const deleteFlag = async (id) => {
   try {
     await API.delete(`/org-admin/flags/${id}`);
     fetchFlags();
     setMsg('Flag deleted!');
   } catch (err) {
     setMsg(err.response?.data?.message || 'Error deleting flag');
   }
 };
 const logout = () => {
   localStorage.removeItem('adminToken');
   onLogout?.();
   navigate('/', { replace: true });
 };
 const styles = {
   page: { minHeight: '100vh', padding: '32px 16px', background: '#eef2ff' },
   card: { maxWidth: 980, margin: '0 auto', padding: 32, background: '#ffffff', borderRadius: 28, boxShadow: '0 32px 90px rgba(15, 23, 42, 0.12)', border: '1px solid rgba(15, 23, 42, 0.08)' },
   header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 },
   titleGroup: { minWidth: 0 },
   title: { margin: 0, fontSize: 32, color: '#111827' },
   subtitle: { margin: '8px 0 0', color: '#6b7280', lineHeight: 1.7 },
   button: { padding: '14px 18px', background: '#f59e0b', border: 'none', borderRadius: 14, color: '#111827', fontWeight: 700, cursor: 'pointer', minWidth: 160 },
   actionRow: { display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 28, alignItems: 'center' },
   input: { flex: 1, minWidth: 240, padding: '14px 16px', borderRadius: 16, border: '1px solid #d1d5db', background: '#f8fafc', color: '#111827', fontSize: 15 },
   message: { marginTop: 18, color: msg.startsWith('Error') || msg.includes('deleted') ? '#b91c1c' : '#15803d' },
   table: { width: '100%', borderCollapse: 'collapse', marginTop: 24 },
   th: { padding: 14, textAlign: 'left', background: '#f8fafc', color: '#475569', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.03em' },
   td: { padding: 14, borderBottom: '1px solid #e5e7eb' },
   status: { fontWeight: 700 },
   actionBtn: { padding: '10px 14px', borderRadius: 12, border: 'none', background: '#f59e0b', color: '#111827', cursor: 'pointer' },
   deleteButton: { padding: '10px 14px', borderRadius: 12, border: 'none', background: '#ef4444', color: '#ffffff', cursor: 'pointer' }
 };
 return (
   <div style={styles.page}>
     <div style={styles.card}>
       <div style={styles.header}>
         <div style={styles.titleGroup}>
           <h1 style={styles.title}>Admin Dashboard</h1>
           <p style={styles.subtitle}>Manage feature flags for your organization with one simple interface.</p>
         </div>
         <button onClick={logout} style={styles.button}>Logout</button>
       </div>
       <div style={styles.actionRow}>
         <input value={key} onChange={e => setKey(e.target.value)} placeholder='Feature key, e.g. dark_mode' style={styles.input} />
         <button onClick={createFlag} disabled={!key.trim()} style={{
           ...styles.button,
           opacity: key.trim() ? 1 : 0.55,
           cursor: key.trim() ? 'pointer' : 'not-allowed'
         }}>
           Add Flag
         </button>
       </div>
       {msg && <p style={styles.message}>{msg}</p>}
       <table style={styles.table}>
         <thead>
           <tr>
             <th style={styles.th}>Feature Key</th>
             <th style={styles.th}>Status</th>
             <th style={styles.th}>Actions</th>
           </tr>
         </thead>
         <tbody>
           {flags.map(f => (
             <tr key={f._id}>
               <td style={styles.td}>{f.feature_key}</td>
               <td style={{ ...styles.td, ...styles.status, color: f.enabled ? '#15803d' : '#b91c1c' }}>
                 {f.enabled ? 'Enabled' : 'Disabled'}
               </td>
               <td style={styles.td}>
                 <button onClick={() => toggleFlag(f._id, f.enabled)} style={{ ...styles.actionBtn, marginRight: 8 }}>
                   {f.enabled ? 'Disable' : 'Enable'}
                 </button>
                 <button onClick={() => deleteFlag(f._id)} style={styles.deleteButton}>Delete</button>
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
   </div>
 );
}
