import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import { ArrowUpDown, User, LayoutDashboard, Wrench, BarChart3, CheckCircle } from 'lucide-react'
import LanguageSelector from '../components/LanguageSelector'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useApp()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const quickLoginUsers = [
    {
      email: 'client@liftcare.kz',
      password: 'demo123',
      role: 'client',
      title: t.login.client.title,
      description: t.login.client.description,
      icon: User,
      bgColor: 'bg-primary-blue/10',
      iconColor: 'text-primary-blue',
    },
    {
      email: 'dispatcher@liftcare.kz',
      password: 'demo123',
      role: 'dispatcher',
      title: t.login.dispatcher.title,
      description: t.login.dispatcher.description,
      icon: LayoutDashboard,
      bgColor: 'bg-light-blue/10',
      iconColor: 'text-light-blue',
    },
    {
      email: 'engineer@liftcare.kz',
      password: 'demo123',
      role: 'engineer',
      title: t.login.engineer.title,
      description: t.login.engineer.description,
      icon: Wrench,
      bgColor: 'bg-warning-yellow/10',
      iconColor: 'text-warning-yellow',
    },
    {
      email: 'manager@liftcare.kz',
      password: 'demo123',
      role: 'manager',
      title: t.login.manager.title,
      description: t.login.manager.description,
      icon: BarChart3,
      bgColor: 'bg-success-green/10',
      iconColor: 'text-success-green',
    },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const success = login(email, password)

    if (success) {
      const user = quickLoginUsers.find((u) => u.email === email)
      if (user) {
        navigate(`/${user.role}`)
      } else {
        navigate('/')
      }
    } else {
      setError(t.login.invalidCredentials)
    }

    setLoading(false)
  }

  const handleQuickLogin = (user: typeof quickLoginUsers[0]) => {
    setEmail(user.email)
    setPassword(user.password)
    const success = login(user.email, user.password)
    if (success) {
      navigate(`/${user.role}`)
    }
  }

  return (
    <div className="min-h-screen bg-bg-light-blue flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="flex justify-end mb-4"><LanguageSelector /></div>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-dark-blue to-primary-blue">
              <ArrowUpDown className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-dark-blue">{t.common.liftcare}</span>
          </div>
          <p className="text-text-secondary">{t.common.slogan}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-dark-blue mb-6">{t.login.title}</h2>

            {error && (
              <div className="mb-4 p-3 bg-danger-red/10 border border-danger-red/30 rounded-lg text-danger-red text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                  {t.login.email}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                  {t.login.password}
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 text-primary-blue border-gray-300 rounded focus:ring-primary-blue"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-text-secondary">
                  {t.login.rememberMe}
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-primary-blue hover:bg-dark-blue text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t.common.loading : t.login.signIn}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href="/" className="text-sm text-primary-blue hover:text-dark-blue transition-colors">
                {t.login.backToLanding}
              </a>
            </div>
          </div>

          {/* Quick Login */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-dark-blue mb-2">{t.login.quickLogin}</h2>
              <p className="text-text-secondary">{t.login.quickLoginDesc}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickLoginUsers.map((user) => {
                const Icon = user.icon
                return (
                  <button
                    key={user.role}
                    onClick={() => handleQuickLogin(user)}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 p-6 text-left transition-all hover:border-primary-blue group"
                  >
                    <div className={`w-12 h-12 rounded-lg ${user.bgColor} flex items-center justify-center mb-3 group-hover:opacity-80 transition-opacity`}>
                      <Icon className={`w-6 h-6 ${user.iconColor}`} />
                    </div>
                    <h3 className="font-semibold text-dark-blue mb-1">{user.title}</h3>
                    <p className="text-sm text-text-secondary">{user.description}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-primary-blue opacity-0 group-hover:opacity-100 transition-opacity">
                      <CheckCircle className="w-4 h-4" />
                      <span>{t.login.loginAs} {user.email}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="bg-gradient-to-br from-bg-light-blue to-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-dark-blue mb-2">{t.login.demoAccess}</h3>
              <p className="text-sm text-text-secondary mb-3">
                {t.login.demoAccessDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
