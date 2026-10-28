import { Smartphone, FileText, BarChart3, Users, Bell, QrCode, FileCheck, Shield } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Features() {
  const { t } = useLanguage()
  const features = [
    { icon: Smartphone, ...t.landing.features.items.mobile },
    { icon: FileText, ...t.landing.features.items.passports },
    { icon: BarChart3, ...t.landing.features.items.analytics },
    { icon: Users, ...t.landing.features.items.team },
    { icon: Bell, ...t.landing.features.items.notifications },
    { icon: QrCode, ...t.landing.features.items.qr },
    { icon: FileCheck, ...t.landing.features.items.acts },
    { icon: Shield, ...t.landing.features.items.security },
  ]

  return (
    <section id="features" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue mb-4">
            {t.landing.features.title}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {t.landing.features.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary-blue/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-blue" />
                </div>
                <h3 className="text-lg font-semibold text-dark-blue mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
