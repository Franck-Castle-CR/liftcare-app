import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import { ArrowUpDown, LogOut, LayoutDashboard, User, Home } from 'lucide-react'

interface SidebarProps {
  role: 'client' | 'dispatcher' | 'engineer' | 'manager'
}

export default function Sidebar({ role }: SidebarProps) {
  const navigate = useNavigate()
  const { user, logout } = useApp()
  const { t } = useLanguage()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="w-64 bg-dark-blue text-white flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-blue">
            <ArrowUpDown className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold">{t.common.liftcare}</span>
            <p className="text-xs text-white/60">{t.common.slogan}</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-blue flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium text-sm">{user?.name}</p>
            <p className="text-xs text-white/60">{t.role[role]}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left"
            >
              <Home className="w-5 h-5" />
              <span>{t.common.backToHome}</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate(`/${role}`)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-blue text-left"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>{t.common.dashboard}</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left"
        >
          <LogOut className="w-5 h-5" />
          <span>{t.common.logout}</span>
        </button>
      </div>
    </aside>
  )
}
