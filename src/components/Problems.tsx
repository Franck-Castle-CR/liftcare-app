import { Phone, FileText, Clock, EyeOff } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Problems() {
  const { t } = useLanguage()
  const problems = [
    {
      icon: Phone,
      ...t.landing.problems.items.phone,
    },
    {
      icon: FileText,
      ...t.landing.problems.items.docs,
    },
    {
      icon: Clock,
      ...t.landing.problems.items.delays,
    },
    {
      icon: EyeOff,
      ...t.landing.problems.items.blind,
    },
  ]

  return (
    <section id="solution" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue mb-4">
            {t.landing.problems.title}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {t.landing.problems.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => {
            const Icon = problem.icon
            return (
              <div
                key={index}
                className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-danger-red/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-danger-red" />
                </div>
                <h3 className="text-lg font-semibold text-dark-blue mb-2">{problem.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{problem.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
