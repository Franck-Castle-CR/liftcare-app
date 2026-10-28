import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
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
import { Activity, Clock, CheckCircle2, TrendingUp, Bell, Boxes, Building2, CalendarDays, Search, Users } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import Modal from '../components/Modal'

type ManagerSection = 'analytics' | 'equipment' | 'objects' | 'engineers' | 'parts' | 'maintenance' | 'notifications'
const REFERENCE_DATE = new Date()

export default function ManagerDashboard() {
  const { equipment, orders, parts, users, adjustPartStock } = useApp()
  const [section, setSection] = useState<ManagerSection>('analytics')
  const [search, setSearch] = useState('')
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null)
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('liftcare_read_notifications') ?? '[]') as string[] } catch { return [] }
  })

  // Calculate analytics in real-time
  const analytics = useMemo(() => {
    const totalEquipment = equipment.length
    const activeOrders = orders.filter((o) => !['completed', 'closed', 'cancelled'].includes(o.status)).length
    const completedOrders = orders.filter((o) => ['completed', 'closed'].includes(o.status)).length
    const completedWithDeadline = orders.filter((o) => o.completedAt && o.deadline)
    const onTimeRate = completedWithDeadline.length
      ? Math.round((completedWithDeadline.filter((o) => new Date(o.completedAt!).getTime() <= new Date(o.deadline!).getTime()).length / completedWithDeadline.length) * 100)
      : 0
    const responseMinutes = orders.filter((o) => o.assignedAt).map((o) => (new Date(o.assignedAt!).getTime() - new Date(o.createdAt).getTime()) / 60000).filter((minutes) => minutes >= 0 && minutes <= 24 * 60)
    const averageResponse = responseMinutes.length ? Math.round(responseMinutes.reduce((sum, value) => sum + value, 0) / responseMinutes.length) : 0
    const avgResponseTime = `${Math.floor(averageResponse / 60)}ч ${averageResponse % 60}м`

    // Orders by status
    const ordersByStatus = [
      { name: 'Новые', value: orders.filter((o) => o.status === 'new').length, color: '#1769AA' },
      { name: 'Назначены', value: orders.filter((o) => o.status === 'assigned').length, color: '#38A9E0' },
      { name: 'В работе', value: orders.filter((o) => o.status === 'in_progress').length, color: '#F59E0B' },
      { name: 'В пути', value: orders.filter((o) => o.status === 'traveling').length, color: '#38A9E0' },
      { name: 'На объекте', value: orders.filter((o) => o.status === 'arrived').length, color: '#F59E0B' },
      { name: 'Акт ожидает клиента', value: orders.filter((o) => o.status === 'completed').length, color: '#F59E0B' },
      { name: 'Закрыты', value: orders.filter((o) => o.status === 'closed').length, color: '#16A34A' },
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
    const weeklyData = Array.from({ length: 7 }, (_, offset) => {
      const date = new Date(REFERENCE_DATE.getTime())
      date.setDate(date.getDate() - (6 - offset))
      const key = date.toDateString()
      const dailyOrders = orders.filter((order) => new Date(order.createdAt).toDateString() === key)
      return { name: date.toLocaleDateString('ru-RU', { weekday: 'short' }), orders: dailyOrders.length, completed: dailyOrders.filter((order) => ['completed', 'closed'].includes(order.status)).length }
    })

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

  const query = search.trim().toLocaleLowerCase('ru-RU')
  const equipmentResults = equipment.filter((item) => !query || `${item.name} ${item.type} ${item.location}`.toLocaleLowerCase('ru-RU').includes(query))
  const partResults = parts.filter((item) => !query || item.name.toLocaleLowerCase('ru-RU').includes(query))
  const sites = Array.from(equipment.reduce((map, item) => {
    const current = map.get(item.location) ?? { name: item.location, equipment: 0, broken: 0 }
    current.equipment += 1
    if (item.status === 'broken') current.broken += 1
    map.set(item.location, current)
    return map
  }, new Map<string, { name: string; equipment: number; broken: number }>()).values())
  const engineers = users.filter((item) => item.role === 'engineer')
  const today = new Date(REFERENCE_DATE.getTime())
  const notifications = [
    ...orders.filter((order) => order.status === 'new' && order.priority === 'critical').map((order) => ({ id: `order-${order.id}`, title: `Аварийная заявка ${order.orderNumber}`, detail: order.title })),
    ...orders.filter((order) => order.status === 'completed').map((order) => ({ id: `act-${order.id}`, title: `Акт ожидает подтверждения · ${order.orderNumber}`, detail: order.title })),
    ...parts.filter((part) => part.stock <= part.minStock).map((part) => ({ id: `part-${part.id}`, title: `Низкий остаток: ${part.name}`, detail: `${part.stock} ${part.unit} · минимум ${part.minStock}` })),
    ...equipment.filter((item) => item.nextMaintenance && (new Date(`${item.nextMaintenance}T00:00:00`).getTime() - today.getTime()) / 86400000 <= 30 && new Date(`${item.nextMaintenance}T23:59:59`).getTime() >= today.getTime()).map((item) => ({ id: `maintenance-${item.id}`, title: `Скоро плановое ТО · ${item.name}`, detail: `${item.location} · ${new Date(`${item.nextMaintenance}T00:00:00`).toLocaleDateString('ru-RU')}` })),
    ...orders.filter((order) => order.deadline && !['completed', 'closed', 'cancelled'].includes(order.status) && new Date(order.deadline).getTime() < today.getTime()).map((order) => ({ id: `overdue-${order.id}`, title: `Заявка просрочена · ${order.orderNumber}`, detail: order.title })),
  ]
  const selectedEquipment = equipment.find((item) => item.id === selectedEquipmentId)
  const nav: Array<{ id: ManagerSection; label: string; icon: React.ReactNode }> = [
    { id: 'analytics', label: 'Аналитика', icon: <TrendingUp size={17} /> },
    { id: 'equipment', label: 'Оборудование', icon: <Boxes size={17} /> },
    { id: 'objects', label: 'Объекты', icon: <Building2 size={17} /> },
    { id: 'engineers', label: 'Инженеры', icon: <Users size={17} /> },
    { id: 'parts', label: 'Запчасти', icon: <Boxes size={17} /> },
    { id: 'maintenance', label: 'Плановое ТО', icon: <CalendarDays size={17} /> },
    { id: 'notifications', label: `Уведомления${notifications.length ? ` · ${notifications.filter((item) => !readNotificationIds.includes(item.id)).length}` : ''}`, icon: <Bell size={17} /> },
  ]

  return (
    <div className="flex min-h-screen bg-bg-light-blue">
      <Sidebar role="manager" />

      <main className="flex-1 ml-64 p-8 max-md:ml-0 max-md:p-4 max-md:pt-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-dark-blue">Панель руководителя</h1>
            <p className="text-text-secondary">Аналитика и управление</p>
          </div>

          <nav aria-label="Разделы руководителя" className="flex gap-2 overflow-x-auto pb-4 mb-6">
            {nav.map((item) => <button key={item.id} type="button" aria-pressed={section === item.id} onClick={() => { setSection(item.id); setSearch('') }} className={`min-h-11 shrink-0 inline-flex items-center gap-2 rounded-lg px-4 text-sm font-medium ${section === item.id ? 'bg-dark-blue text-white' : 'bg-white text-text-secondary border border-gray-200 hover:text-dark-blue'}`}>{item.icon}{item.label}</button>)}
          </nav>

          {section === 'analytics' && <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8 text-primary-blue" />
                <span className="text-xs text-text-secondary font-medium">в базе</span>
              </div>
              <p className="text-text-secondary text-sm mb-1">Всего оборудования</p>
              <p className="text-3xl font-bold text-dark-blue">{analytics.totalEquipment}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 text-warning-yellow" />
                <span className="text-xs text-text-secondary font-medium">сейчас</span>
              </div>
              <p className="text-text-secondary text-sm mb-1">Активные заявки</p>
              <p className="text-3xl font-bold text-dark-blue">{analytics.activeOrders}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle2 className="w-8 h-8 text-success-green" />
                <span className="text-xs text-text-secondary font-medium">по срокам</span>
              </div>
              <p className="text-text-secondary text-sm mb-1">Выполнено в срок</p>
              <p className="text-3xl font-bold text-dark-blue">{analytics.onTimeRate}%</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-light-blue" />
                <span className="text-xs text-text-secondary font-medium">по заявкам</span>
              </div>
              <p className="text-text-secondary text-sm mb-1">Время реакции</p>
              <p className="text-3xl font-bold text-dark-blue">{analytics.avgResponseTime}</p>
            </div>
          </div>
          </>}

          {section === 'equipment' && <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200"><h2 className="text-xl font-bold text-dark-blue">Цифровой реестр оборудования</h2><SearchBox value={search} onChange={setSearch} placeholder="Поиск по модели, типу или объекту" /></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead className="bg-gray-50 text-text-secondary"><tr><th className="p-4 text-left">Оборудование</th><th className="p-4 text-left">Объект</th><th className="p-4 text-left">Состояние</th><th className="p-4 text-left">Следующее ТО</th><th className="p-4 text-left">Паспорт</th></tr></thead><tbody className="divide-y divide-gray-100">{equipmentResults.map((item) => <tr key={item.id}><td className="p-4 font-medium text-dark-blue">{item.name}<span className="block text-xs font-normal text-text-secondary">{item.id} · {item.type}</span></td><td className="p-4">{item.location}</td><td className="p-4">{item.status === 'broken' ? 'Неисправно' : item.status === 'maintenance' ? 'На ТО' : 'Работает'}</td><td className="p-4">{item.nextMaintenance ?? '—'}</td><td className="p-4"><button onClick={() => setSelectedEquipmentId(item.id)} className="min-h-10 rounded-lg border border-gray-200 px-3 text-primary-blue hover:bg-bg-light-blue">QR-паспорт</button></td></tr>)}</tbody></table></div>
          </section>}

          {section === 'objects' && <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{sites.map((site) => <article key={site.name} className="rounded-xl border border-gray-200 bg-white p-5"><h2 className="font-bold text-dark-blue">{site.name}</h2><p className="mt-3 text-sm text-text-secondary">Оборудования: {site.equipment}</p><p className={`text-sm font-medium ${site.broken ? 'text-danger-red' : 'text-success-green'}`}>{site.broken ? `Неисправно: ${site.broken}` : 'Неисправностей нет'}</p></article>)}</section>}

          {section === 'engineers' && <section className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full min-w-[600px] text-sm"><thead className="bg-gray-50 text-text-secondary"><tr><th className="p-4 text-left">Инженер</th><th className="p-4 text-left">Контакт</th><th className="p-4 text-left">Активные заявки</th><th className="p-4 text-left">Всего выполнено</th></tr></thead><tbody className="divide-y divide-gray-100">{engineers.map((engineer) => <tr key={engineer.id}><td className="p-4 font-medium text-dark-blue">{engineer.name}</td><td className="p-4">{engineer.phone ?? engineer.email}</td><td className="p-4">{orders.filter((order) => order.assignedTo === engineer.id && !['completed', 'closed', 'cancelled'].includes(order.status)).length}</td><td className="p-4">{orders.filter((order) => order.assignedTo === engineer.id && ['completed', 'closed'].includes(order.status)).length}</td></tr>)}</tbody></table></section>}

          {section === 'parts' && <section className="bg-white rounded-xl border border-gray-200 overflow-hidden"><div className="p-5 border-b border-gray-200"><h2 className="text-xl font-bold text-dark-blue">Склад запасных частей</h2><SearchBox value={search} onChange={setSearch} placeholder="Поиск запчастей" /></div><div className="overflow-x-auto"><table className="w-full min-w-[600px] text-sm"><thead className="bg-gray-50 text-text-secondary"><tr><th className="p-4 text-left">Наименование</th><th className="p-4 text-left">Остаток</th><th className="p-4 text-left">Минимум</th><th className="p-4 text-left">Стоимость</th><th className="p-4 text-left">Действие</th></tr></thead><tbody className="divide-y divide-gray-100">{partResults.map((part) => <tr key={part.id}><td className="p-4 font-medium text-dark-blue">{part.name}<span className="block text-xs font-normal text-text-secondary">{part.id} · {part.manufacturer}</span><span className="block text-xs font-normal text-text-secondary">{part.warehouse} · {part.compatibleEquipment?.join(', ')}</span></td><td className={`p-4 font-semibold ${part.stock <= part.minStock ? 'text-danger-red' : 'text-dark-blue'}`}>{part.stock} {part.unit}</td><td className="p-4">{part.minStock} {part.unit}</td><td className="p-4">{part.price.toLocaleString('ru-RU')} ₸</td><td className="p-4"><button onClick={() => adjustPartStock(part.id, 1)} className="min-h-10 rounded-lg bg-primary-blue px-3 text-white hover:bg-dark-blue">+1 на склад</button></td></tr>)}</tbody></table></div></section>}

          {section === 'maintenance' && <section className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><div className="p-5"><h2 className="text-xl font-bold text-dark-blue">Плановое техническое обслуживание</h2><p className="text-sm text-text-secondary mt-1">Даты показаны по цифровым паспортам оборудования.</p></div><table className="w-full min-w-[700px] text-sm"><thead className="bg-gray-50 text-text-secondary"><tr><th className="p-4 text-left">Оборудование и объект</th><th className="p-4 text-left">Последнее ТО</th><th className="p-4 text-left">Следующее ТО</th><th className="p-4 text-left">Статус</th></tr></thead><tbody className="divide-y divide-gray-100">{equipment.filter((item) => item.nextMaintenance).sort((a, b) => (a.nextMaintenance ?? '').localeCompare(b.nextMaintenance ?? '')).map((item) => <tr key={item.id}><td className="p-4 font-medium text-dark-blue">{item.name}<span className="block text-xs font-normal text-text-secondary">{item.location}</span></td><td className="p-4">{item.lastMaintenance ?? '—'}</td><td className="p-4">{item.nextMaintenance}</td><td className="p-4">{new Date(`${item.nextMaintenance}T00:00:00`).getTime() < REFERENCE_DATE.getTime() ? <span className="text-danger-red font-semibold">Просрочено</span> : 'Запланировано'}</td></tr>)}</tbody></table></section>}

          {section === 'notifications' && <section className="bg-white rounded-xl border border-gray-200"><div className="p-5 border-b border-gray-200 flex flex-wrap justify-between gap-3"><div><h2 className="text-xl font-bold text-dark-blue">Уведомления</h2><p className="text-sm text-text-secondary">События по заявкам, актам и складским остаткам.</p></div><button onClick={() => { setReadNotificationIds(notifications.map((item) => item.id)); localStorage.setItem('liftcare_read_notifications', JSON.stringify(notifications.map((item) => item.id))) }} className="min-h-10 rounded-lg border border-gray-200 px-3 text-sm hover:bg-gray-50">Прочитать все</button></div><div className="divide-y divide-gray-100">{notifications.length ? notifications.map((item) => <article key={item.id} className={`flex flex-wrap items-center justify-between gap-3 p-5 ${readNotificationIds.includes(item.id) ? '' : 'bg-primary-blue/5'}`}><div><p className="font-semibold text-dark-blue">{item.title}{!readNotificationIds.includes(item.id) && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary-blue" aria-label="Непрочитано" />}</p><p className="text-sm text-text-secondary mt-1">{item.detail}</p></div><button onClick={() => { const next = [...new Set([...readNotificationIds, item.id])]; setReadNotificationIds(next); localStorage.setItem('liftcare_read_notifications', JSON.stringify(next)) }} className="min-h-10 rounded-lg border border-gray-200 px-3 text-sm hover:bg-gray-50">{readNotificationIds.includes(item.id) ? 'Прочитано' : 'Отметить прочитанным'}</button></article>) : <p className="p-8 text-center text-text-secondary">Новых уведомлений нет.</p>}</div></section>}

          <Modal isOpen={selectedEquipmentId !== null} onClose={() => setSelectedEquipmentId(null)} title="Цифровой паспорт оборудования">
            {selectedEquipment && <div className="space-y-4"><div className="flex items-center gap-4 rounded-lg bg-bg-light-blue p-4"><QRCodeSVG value={selectedEquipment.qrCode} size={120} /><div><h3 className="font-bold text-dark-blue">{selectedEquipment.name}</h3><p className="text-sm text-text-secondary mt-1">{selectedEquipment.location}</p><p className="text-sm text-text-secondary">Установлено: {selectedEquipment.installationDate}</p><p className="text-sm text-text-secondary">Следующее ТО: {selectedEquipment.nextMaintenance ?? '—'}</p></div></div><h4 className="font-semibold text-dark-blue">История ремонтов</h4>{selectedEquipment.repairHistory.length ? selectedEquipment.repairHistory.map((repair, index) => <p key={`${repair.date}-${index}`} className="border-b border-gray-100 py-2 text-sm">{repair.date} · {repair.description} · {repair.cost.toLocaleString('ru-RU')} ₸</p>) : <p className="text-sm text-text-secondary">Записей пока нет.</p>}</div>}
          </Modal>

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

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="mt-4 flex min-h-11 max-w-xl items-center gap-2 rounded-lg border border-gray-200 px-3 focus-within:ring-2 focus-within:ring-primary-blue"><Search size={18} className="text-text-secondary" /><span className="sr-only">{placeholder}</span><input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full border-0 bg-transparent py-2 outline-none" /></label>
}
