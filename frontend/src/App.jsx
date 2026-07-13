import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Tasks from './pages/Tasks.jsx';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppContent() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vivid_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        localStorage.removeItem('vivid_user');
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Force dark theme on mount
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.style.backgroundColor = '#09090b';
    setLoading(false);
  }, []);

  const handleAuthSuccess = (userData) => {
    localStorage.setItem('vivid_user', JSON.stringify(userData));
    setUser(userData);
    navigate('/tasks');
  };

  const handleLogout = () => {
    localStorage.removeItem('vivid_user');
    setUser(null);
    navigate('/');
  };

  if (loading) {
    return (
      <div id="global_loader" className="min-h-screen w-full flex flex-col items-center justify-center bg-[#09090b] text-white gap-4 relative overflow-hidden">
        <div className="mesh-bg"></div>
        <div className="relative">
          <div className="w-14 h-14 rounded-full border border-dashed border-white/20 animate-spin flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="vivid_app" className="min-h-screen relative font-sans transition-colors duration-500 bg-[#09090b] text-zinc-100">
      <div className="mesh-bg"></div>
      
      <Routes>
        <Route 
          path="/" 
          element={
            user ? (
              <Navigate to="/tasks" replace />
            ) : (
              <Home onAuthSuccess={handleAuthSuccess} />
            )
          } 
        />
        <Route 
          path="/tasks" 
          element={
            <ProtectedRoute user={user}>
              <Tasks user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
