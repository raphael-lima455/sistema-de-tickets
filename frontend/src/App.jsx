import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tickets from './pages/Tickets'
import Users from './pages/Users'
import AppShell from './components/AppShell'
import ProtectedRoute from './components/ProtectedRoute'
import { Navigate } from 'react-router-dom'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      <Route path="/app" element={<AppShell />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tickets" element={<Tickets />} />
        
        {/* Rota protegida - só admin */}
        <Route 
          path="users" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Users />
            </ProtectedRoute>
          } 
        />
      </Route>
    </Routes>
  )
}

export default App