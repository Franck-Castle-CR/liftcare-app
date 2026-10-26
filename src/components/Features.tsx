import { Smartphone, FileText, BarChart3, Users, Bell, QrCode, FileCheck, Shield } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Smartphone,
      title: 'Мобильное приложение',
      description: 'Удобный интерфейс для инженеров на смартфонах и планшетах',
    },
    {
      icon: FileText,
      title: 'Цифровые паспорта',
      description: 'Полная история каждого оборудования в одном месте',
    },
    {
      icon: BarChart3,
      title: 'Аналитика и отчеты',
      description: 'Графики и статистика для принятия решений',
    },
    {
      icon: Users,
      title: 'Управление командой',
      description: 'Распределение заявок и контроль работы инженеров',
    },
    {
      icon: Bell,
      title: 'Уведомления',
      description: 'Мгновенные оповещения о новых заявках и сроках',
    },
    {
      icon: QrCode,
      title: 'QR-коды',
      description: 'Быстрый доступ к информации через сканирование',
    },
    {
      icon: FileCheck,
      title: 'Электронные акты',
      description: 'Подписание документов в системе без бумаги',
    },
    {
      icon: Shield,
      title: 'Безопасность данных',
      description: 'Защита информации и контроль доступа',
    },
  ]

  return (
    <section id="features" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue mb-4">
            Возможности платформы
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Полный набор инструментов для эффективного управления оборудованием
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
