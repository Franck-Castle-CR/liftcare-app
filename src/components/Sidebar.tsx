import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import LanguageSelector from './LanguageSelector'
import { ArrowUpDown, LogOut, LayoutDashboard, User, Home, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  role: 'client' | 'dispatcher' | 'engineer' | 'manager'
}

export default function Sidebar({ role }: SidebarProps) {
  const navigate = useNavigate()
  const { user, logout } = useApp()
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
    <button type="button" aria-label={t.ui.menuOpen} aria-expanded={open} onClick={() => setOpen(true)} className="hidden max-md:flex fixed left-4 top-4 z-40 min-h-11 min-w-11 items-center justify-center rounded-lg bg-dark-blue text-white shadow-lg"><Menu size={22} /></button>
    {open && <button type="button" aria-label={t.ui.menuClose} onClick={() => setOpen(false)} className="md:hidden fixed inset-0 z-40 bg-black/40" />}
    <aside className={`w-64 bg-dark-blue text-white flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform ${open ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'}`}>
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
              onClick={() => { setOpen(false); navigate('/') }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left"
            >
              <Home className="w-5 h-5" />
              <span>{t.common.backToHome}</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => { setOpen(false); navigate(`/${role}`) }}
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
        <div className="mb-3"><LanguageSelector compact /></div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left"
        >
          <LogOut className="w-5 h-5" />
          <span>{t.common.logout}</span>
        </button>
      </div>
      <button type="button" aria-label={t.ui.menuClose} onClick={() => setOpen(false)} className="md:hidden absolute right-3 top-3 min-h-11 min-w-11 rounded-lg hover:bg-white/10 flex items-center justify-center"><X size={20} /></button>
    </aside>
    </>
  )
}
