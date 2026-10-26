import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import Sidebar from '../components/Sidebar'
import StatusBadge from '../components/StatusBadge'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Activity, Clock, CheckCircle2, TrendingUp } from 'lucide-react'

export default function ManagerDashboard() {
  const { equipment, orders, parts } = useApp()
  const { t } = useLanguage()

  // Calculate analytics in real-time
  const analytics = useMemo(() => {
    const totalEquipment = equipment.length
    const activeOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length
    const completedOrders = orders.filter((o) => o.status === 'completed').length
    const onTimeRate = completedOrders > 0 ? 94 : 0 // Simplified calculation

    // Calculate average response time (mock)
    const avgResponseTime = '2ч 35м'

    // Orders by status
    const ordersByStatus = [
      { name: 'Новые', value: orders.filter((o) => o.status === 'new').length, color: '#1769AA' },
      { name: 'Назначены', value: orders.filter((o) => o.status === 'assigned').length, color: '#38A9E0' },
      { name: 'В работе', value: orders.filter((o) => o.status === 'in_progress').length, color: '#F59E0B' },
      { name: 'Завершены', value: orders.filter((o) => o.status === 'completed').length, color: '#16A34A' },
    ]

    // Orders by priority
    const ordersByPriority = [
      { name: 'Низкий', value: orders.filter((o) => o.priority === 'low').length },
      { name: 'Средний', value: orders.filter((o) => o.priority === 'medium').length },
      { name: 'Высокий', value: orders.filter((o) => o.priority === 'high').length },
      { name: 'Критический', value: orders.filter((o) => o.priority === 'critical').length },
    ]

    // Equipment by status
    const equipmentByStatus = [
      { name: 'Активно', value: equipment.filter((e) => e.status === 'active').length },
      { name: 'ТО', value: equipment.filter((e) => e.status === 'maintenance').length },
      { name: 'Неисправно', value: equipment.filter((e) => e.status === 'broken').length },
    ]

    // Weekly data (mock)
    const weeklyData = [
      { name: 'Пн', orders: 12, completed: 10 },
      { name: 'Вт', orders: 18, completed: 15 },
      { name: 'Ср', orders: 15, completed: 13 },
      { name: 'Чт', orders: 22, completed: 20 },
      { name: 'Пт', orders: 25, completed: 23 },
      { name: 'Сб', orders: 8, completed: 7 },
      { name: 'Вс', orders: 10, completed: 9 },
    ]

    // Low stock parts
    const lowStockParts = parts.filter((p) => p.stock <= p.minStock)

    return {
      totalEquipment,
      activeOrders,
      completedOrders,
      onTimeRate,
      avgResponseTime,
      ordersByStatus,
      ordersByPriority,
      equipmentByStatus,
      weeklyData,
      lowStockParts,
    }
  }, [equipment, orders, parts])

  return (
    <div className="flex min-h-screen bg-bg-light-blue">
      <Sidebar role="manager" />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-dark-blue">Панель руководителя</h1>
            <p className="text-text-secondary">Аналитика и управление</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8 text-primary-blue" />
                <span className="text-xs text-success-green font-medium">+12%</span>
              </div>
              <p className="text-text-secondary text-sm mb-1">Всего оборудования</p>
              <p className="text-3xl font-bold text-dark-blue">{analytics.totalEquipment}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 text-warning-yellow" />
                <span className="text-xs text-warning-yellow font-medium">-3%</span>
              </div>
              <p className="text-text-secondary text-sm mb-1">Активные заявки</p>
              <p className="text-3xl font-bold text-dark-blue">{analytics.activeOrders}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle2 className="w-8 h-8 text-success-green" />
                <span className="text-xs text-success-green font-medium">+5%</span>
              </div>
              <p className="text-text-secondary text-sm mb-1">Выполнено в срок</p>
              <p className="text-3xl font-bold text-dark-blue">{analytics.onTimeRate}%</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-light-blue" />
                <span className="text-xs text-success-green font-medium">-8%</span>
              </div>
              <p className="text-text-secondary text-sm mb-1">Время реакции</p>
              <p className="text-3xl font-bold text-dark-blue">{analytics.avgResponseTime}</p>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Orders by Status */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-dark-blue mb-4">Заявки по статусу</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.ordersByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analytics.ordersByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Orders by Priority */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-dark-blue mb-4">Заявки по приоритету</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.ordersByPriority}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="value" fill="#1769AA" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Weekly Orders */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-dark-blue mb-4">Динамика заявок за неделю</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="orders" stroke="#1769AA" strokeWidth={2} dot={{ fill: '#1769AA' }} />
                    <Line type="monotone" dataKey="completed" stroke="#16A34A" strokeWidth={2} dot={{ fill: '#16A34A' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Equipment Status */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-dark-blue mb-4">Состояние оборудования</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.equipmentByStatus}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="value" fill="#38A9E0" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          {analytics.lowStockParts.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-danger-red/200 mb-8">
              <h3 className="text-lg font-bold text-danger-red mb-4 flex items-center gap-2">
                ⚠️ Запчасти с низким остатком
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.lowStockParts.map((part) => (
                  <div key={part.id} className="bg-danger-red/10 rounded-lg p-4 border border-danger-red/20">
                    <p className="font-semibold text-dark-blue mb-1">{part.name}</p>
                    <p className="text-sm text-danger-red font-medium">
                      Остаток: {part.stock} {part.unit} (минимум: {part.minStock})
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-dark-blue">Последние заявки</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-sm text-text-secondary mb-1">{order.orderNumber}</p>
                      <p className="font-medium text-dark-blue">{order.title}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
