import { Building2, Factory, Settings, ShoppingBag } from 'lucide-react'

export default function ForWho() {
  const audiences = [
    {
      icon: Building2,
      title: 'Управляющие компании',
      description: 'Жилищные комплексы и офисные центры с лифтовым оборудованием',
    },
    {
      icon: Factory,
      title: 'Промышленные предприятия',
      description: 'Заводы и производственные площадки с конвейерным оборудованием',
    },
    {
      icon: Settings,
      title: 'Сервисные компании',
      description: 'Организации, предоставляющие услуги по ремонту и обслуживанию',
    },
    {
      icon: ShoppingBag,
      title: 'Торговые центры',
      description: 'Моллы и розничные сети с автоматикой и эскалаторами',
    },
  ]

  return (
    <section id="for-who" className="py-16 lg:py-24 bg-bg-light-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue mb-4">
            Для кого LiftCare
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Решение адаптировано под различные отрасли и типы бизнеса
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((audience, index) => {
            const Icon = audience.icon
            return (
              <div
                key={index}
                className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-light-blue/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-light-blue" />
                </div>
                <h3 className="text-lg font-semibold text-dark-blue mb-2">{audience.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{audience.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
