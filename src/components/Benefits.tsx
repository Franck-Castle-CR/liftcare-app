import { TrendingUp, Clock, ShieldCheck, Zap } from 'lucide-react'

export default function Benefits() {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'На 40% быстрее',
      description: 'Сокращение времени обработки заявок за счет автоматизации',
    },
    {
      icon: Clock,
      title: 'Сэкономьте время',
      description: 'Меньше ручной работы и бумажных документов',
    },
    {
      icon: ShieldCheck,
      title: 'Прозрачность',
      description: 'Полный контроль над состоянием оборудования в реальном времени',
    },
    {
      icon: Zap,
      title: 'Быстрый старт',
      description: 'Внедрение за 2 недели без остановки работы',
    },
  ]

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue mb-4">
            Преимущества LiftCare
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Почему компании выбирают нашу платформу
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-bg-light-blue to-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-success-green/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-success-green" />
                </div>
                <h3 className="text-lg font-semibold text-dark-blue mb-2">{benefit.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
