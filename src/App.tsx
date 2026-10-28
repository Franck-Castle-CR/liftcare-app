import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { LanguageProvider } from './context/LanguageContext'
import Landing from './pages/Landing'
import Login from './pages/Login'

const ClientDashboard = lazy(() => import('./pages/ClientDashboard'))
const DispatcherDashboard = lazy(() => import('./pages/DispatcherDashboard'))
const EngineerDashboard = lazy(() => import('./pages/EngineerDashboard'))
const ManagerDashboard = lazy(() => import('./pages/ManagerDashboard'))

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
    <Suspense fallback={<div role="status" className="min-h-screen grid place-items-center text-dark-blue">Загрузка LiftCare…</div>}>
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
    </Suspense>
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
