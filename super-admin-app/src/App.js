import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
function App() {
 const [token, setToken] = useState(localStorage.getItem('token'));
 useEffect(() => {
   const onStorage = () => setToken(localStorage.getItem('token'));
   window.addEventListener('storage', onStorage);
   return () => window.removeEventListener('storage', onStorage);
 }, []);
 return (
  <BrowserRouter>
  <Routes>
  <Route path='/' element={token ? <Navigate to='/dashboard' /> : <Login setToken={setToken} />} />
  <Route path='/dashboard' element={token ? <Dashboard onLogout={() => setToken(null)} /> : <Navigate to='/' />} />
 </Routes>
 </BrowserRouter>
 );
}
export default App;
  