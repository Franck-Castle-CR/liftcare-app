import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowRight, FileText, Clock, CheckCircle2, Activity } from 'lucide-react'

const mockData = [
  { name: 'Пн', closed: 12 },
  { name: 'Вт', closed: 18 },
  { name: 'Ср', closed: 15 },
  { name: 'Чт', closed: 22 },
  { name: 'Пт', closed: 25 },
  { name: 'Сб', closed: 8 },
  { name: 'Вс', closed: 10 },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-bg-light-blue to-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-blue leading-tight">
              Управляйте ремонтом и техническим обслуживанием в одной системе
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed">
              LiftCare помогает принимать заявки, назначать инженеров, контролировать сроки, вести цифровые паспорта оборудования и формировать электронные акты
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-primary-blue hover:bg-dark-blue rounded-lg transition-colors"
              >
                Открыть демоверсию
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-primary-blue bg-white border-2 border-primary-blue hover:bg-bg-light-blue rounded-lg transition-colors"
              >
                Создать заявку
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Заказать презентацию
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
                    <span className="text-sm text-text-secondary">Оборудование</span>
                  </div>
                  <p className="text-2xl font-bold text-dark-blue">248</p>
                  <p className="text-xs text-text-secondary">единиц</p>
                </div>
                <div className="bg-gradient-to-br from-bg-light-blue to-white p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-warning-yellow" />
                    <span className="text-sm text-text-secondary">Активные заявки</span>
                  </div>
                  <p className="text-2xl font-bold text-dark-blue">32</p>
                  <p className="text-xs text-text-secondary">в работе</p>
                </div>
                <div className="bg-gradient-to-br from-bg-light-blue to-white p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-success-green" />
                    <span className="text-sm text-text-secondary">Выполнено в срок</span>
                  </div>
                  <p className="text-2xl font-bold text-dark-blue">94%</p>
                  <p className="text-xs text-text-secondary">эффективность</p>
                </div>
                <div className="bg-gradient-to-br from-bg-light-blue to-white p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-light-blue" />
                    <span className="text-sm text-text-secondary">Время реакции</span>
                  </div>
                  <p className="text-2xl font-bold text-dark-blue">2ч 35м</p>
                  <p className="text-xs text-text-secondary">в среднем</p>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-gradient-to-br from-bg-light-blue to-white p-4 rounded-xl border border-gray-100">
                <h3 className="text-sm font-medium text-text-primary mb-4">Динамика закрытия заявок</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        stroke="#64748B"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#64748B"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="closed"
                        stroke="#1769AA"
                        strokeWidth={2}
                        dot={{ fill: '#1769AA', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
