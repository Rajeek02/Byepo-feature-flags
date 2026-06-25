import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Dashboard({ onLogout }) {
  const [orgs, setOrgs] = useState([]);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const styles = {
    page: { minHeight: '100vh', padding: '32px 16px', background: '#eef2ff' },
    card: { maxWidth: 980, margin: '0 auto', padding: 32, background: '#ffffff', borderRadius: 28, boxShadow: '0 32px 90px rgba(15, 23, 42, 0.12)', border: '1px solid rgba(15, 23, 42, 0.08)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 },
    titleGroup: { minWidth: 0 },
    title: { margin: 0, fontSize: 32, color: '#111827' },
    subtitle: { margin: '8px 0 0', color: '#6b7280', lineHeight: 1.7 },
    button: { padding: '14px 18px', background: '#f59e0b', border: 'none', borderRadius: 14, color: '#111827', fontWeight: 700, cursor: 'pointer', minWidth: 190 },
    actionRow: { display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 28, alignItems: 'center' },
    input: { flex: 1, minWidth: 240, padding: '14px 16px', borderRadius: 16, border: '1px solid #d1d5db', background: '#f8fafc', color: '#111827', fontSize: 15 },
    message: { marginTop: 18, color: msg.startsWith('Error') ? '#b91c1c' : '#15803d' },
    sectionTitle: { marginTop: 38, marginBottom: 18, fontSize: 22, color: '#111827' },
    list: { listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 },
    item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '20px 22px', borderRadius: 18, background: '#f8fafc', border: '1px solid #e5e7eb' },
    itemContent: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 },
    itemName: { margin: 0, fontSize: 18, lineHeight: 1.3, color: '#111827', fontWeight: 600 },
    deleteButton: { padding: '10px 14px', borderRadius: 12, border: 'none', background: '#ef4444', color: '#ffffff', cursor: 'pointer' }
  };

  const fetchOrgs = useCallback(async () => {
    try {
      const res = await API.get('/super-admin/organizations');
      setOrgs(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }
      setMsg(err.response?.data?.message || 'Unable to load organizations');
    }
  }, [navigate]);

  useEffect(() => { fetchOrgs(); }, [fetchOrgs]);
  const canCreate = name.trim().length > 0;
  const createOrg = async () => {
    if (!canCreate) return;
    try {
      await API.post('/super-admin/organizations', { name });
      setName('');
      setMsg('Organization created!');
      fetchOrgs();
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        onLogout?.();
        navigate('/');
        return;
      }
      setMsg(err.response?.data?.message || 'Error');
    }
  };
  const deleteOrg = async (id) => {
    try {
      await API.delete(`/super-admin/organizations/${id}`);
      setMsg('Organization deleted!');
      fetchOrgs();
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        onLogout?.();
        navigate('/');
        return;
      }
      setMsg(err.response?.data?.message || 'Error deleting organization');
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    onLogout?.();
    navigate('/', { replace: true });
  };
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.titleGroup}>
            <h1 style={styles.title}>Super Admin Dashboard</h1>
            <p style={styles.subtitle}>Create and manage organizations in one sleek place.</p>
          </div>
          <button onClick={logout} style={styles.button}>Logout</button>
        </div>
        <div style={styles.actionRow}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder='Organization name' style={styles.input} />
          <button onClick={createOrg} disabled={!canCreate} style={{
            ...styles.button,
            opacity: canCreate ? 1 : 0.55,
            cursor: canCreate ? 'pointer' : 'not-allowed'
          }}>
            Create Organization
          </button>
        </div>
        {msg && <p style={styles.message}>{msg}</p>}
        <h2 style={styles.sectionTitle}>Organizations ({orgs.length})</h2>
        <ul style={styles.list}>
          {orgs.map(o => (
            <li key={o._id} style={styles.item}>
              <div style={styles.itemContent}>
                <p style={styles.itemName}>{o.name}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}