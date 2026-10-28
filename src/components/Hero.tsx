import { ArrowRight, FileText, Clock, CheckCircle2, Activity } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Hero() {
  const { t, language } = useLanguage()
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-bg-light-blue to-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-blue leading-tight">
              {t.landing.hero.title}
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed">
              {t.landing.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-primary-blue hover:bg-dark-blue rounded-lg transition-colors"
              >
                {t.landing.hero.cta1}
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-primary-blue bg-white border-2 border-primary-blue hover:bg-bg-light-blue rounded-lg transition-colors"
              >
                {t.landing.hero.cta2}
              </a>
              <a
                href="mailto:info@liftcare.kz?subject=Презентация%20LiftCare"
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                {t.landing.hero.cta3}
              </a>
            </div>
          </div>

          {/* Right content - Product preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              {/* Stat cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-bg-light-blue to-white p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-primary-blue" />
                    <span className="text-sm text-text-secondary">{t.manager.totalEquipment}</span>
                  </div>
                  <p className="text-2xl font-bold text-dark-blue">248</p>
                  <p className="text-xs text-text-secondary">{t.ui.unitShort}</p>
                </div>
                <div className="bg-gradient-to-br from-bg-light-blue to-white p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-warning-yellow" />
                    <span className="text-sm text-text-secondary">{t.manager.activeOrders}</span>
                  </div>
                  <p className="text-2xl font-bold text-dark-blue">32</p>
                  <p className="text-xs text-text-secondary">{t.status.inProgress}</p>
                </div>
                <div className="bg-gradient-to-br from-bg-light-blue to-white p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-success-green" />
                    <span className="text-sm text-text-secondary">{t.manager.onTimeRate}</span>
                  </div>
                  <p className="text-2xl font-bold text-dark-blue">94%</p>
                  <p className="text-xs text-text-secondary">{t.ui.onTime}</p>
                </div>
                <div className="bg-gradient-to-br from-bg-light-blue to-white p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-light-blue" />
                    <span className="text-sm text-text-secondary">{t.manager.responseTime}</span>
                  </div>
                  <p className="text-2xl font-bold text-dark-blue">{language === 'en' ? '2h 35m' : language === 'kk' ? '2 сағ 35 мин' : '2ч 35м'}</p>
                  <p className="text-xs text-text-secondary">{t.ui.average}</p>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-gradient-to-br from-bg-light-blue to-white p-4 rounded-xl border border-gray-100">
                <h3 className="text-sm font-medium text-text-primary mb-4">{t.manager.weeklyDynamics}</h3>
                <svg viewBox="0 0 640 220" role="img" aria-label={t.manager.weeklyDynamics} className="w-full h-48">
                  {[35, 75, 115, 155].map((y) => <line key={y} x1="40" y1={y} x2="620" y2={y} stroke="#dbe4ec" strokeDasharray="5 6" />)}
                  <polyline points="55,145 145,105 235,125 325,75 415,55 505,155 595,120" fill="none" stroke="#1769AA" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                  {[[55,145],[145,105],[235,125],[325,75],[415,55],[505,155],[595,120]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="7" fill="#1769AA" stroke="white" strokeWidth="3" />)}
                  {(language === 'en' ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] : language === 'kk' ? ['Дс','Сс','Ср','Бс','Жм','Сн','Жс'] : ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']).map((day, index) => <text key={day} x={55 + index * 90} y="205" textAnchor="middle" fill="#64748B" fontSize="14">{day}</text>)}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
