import { CheckCircle, FileCheck, User, Wrench, FileText, BarChart3, LayoutDashboard } from 'lucide-react'

export default function SolutionTimeline() {
  const steps = [
    { icon: FileCheck, title: 'Заявка', description: 'Клиент создает заявку через портал или приложение' },
    { icon: LayoutDashboard, title: 'Диспетчер', description: 'Заявка автоматически распределяется по инженерам' },
    { icon: User, title: 'Инженер', description: 'Инженер получает уведомление и принимает работу' },
    { icon: FileText, title: 'Диагностика', description: 'Проводится осмотр и фиксируется дефект' },
    { icon: Wrench, title: 'Ремонт', description: 'Выполняются ремонтные работы и замена деталей' },
    { icon: CheckCircle, title: 'Электронный акт', description: 'Формируется и подписывается электронный акт' },
    { icon: BarChart3, title: 'Аналитика', description: 'Данные попадают в отчеты и аналитику' },
  ]

  return (
    <section className="py-16 lg:py-24 bg-bg-light-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-blue mb-4">
            Как работает LiftCare
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Прозрачный процесс от заявки до аналитики в одной системе
          </p>
        </div>

        <div className="relative">
          {/* Timeline line - desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary-blue/20 -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={index}
                  className="relative bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Timeline connector for mobile */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden absolute -right-3 top-1/2 w-6 h-0.5 bg-primary-blue/20 -translate-y-1/2" />
                  )}

                  <div className="w-12 h-12 rounded-lg bg-primary-blue/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-blue" />
                  </div>
                  <h3 className="text-lg font-semibold text-dark-blue mb-2">{step.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{step.description}</p>

                  {/* Step number badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary-blue text-white text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
