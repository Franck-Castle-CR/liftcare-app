import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { LanguageProvider } from './context/LanguageContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import ClientDashboard from './pages/ClientDashboard'
import DispatcherDashboard from './pages/DispatcherDashboard'
import EngineerDashboard from './pages/EngineerDashboard'
import ManagerDashboard from './pages/ManagerDashboard'

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: string }) {
  const { user } = useApp()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/${user.role}`} replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  const { user } = useApp()

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={user ? <Navigate to={`/${user.role}`} replace /> : <Login />}
      />
      <Route
        path="/client"
        element={
          <ProtectedRoute allowedRole="client">
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dispatcher"
        element={
          <ProtectedRoute allowedRole="dispatcher">
            <DispatcherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/engineer"
        element={
          <ProtectedRoute allowedRole="engineer">
            <EngineerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRole="manager">
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AppProvider>
    </LanguageProvider>
  )
}

export default App
