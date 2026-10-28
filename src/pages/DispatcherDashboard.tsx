import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import Sidebar from '../components/Sidebar'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import { Clock, MapPin, User, AlertCircle } from 'lucide-react'

function getDefaultDeadline(priority: string) {
  const date = new Date()
  date.setHours(date.getHours() + (priority === 'critical' ? 2 : 24))
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 16)
}

export default function DispatcherDashboard() {
  const { orders, equipment, users, updateOrderStatus } = useApp()
  const { t } = useLanguage()
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'map'>('list')
  const [assignmentForm, setAssignmentForm] = useState({
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    deadline: '',
    assignedTo: '',
  })

  const engineers = users.filter((u) => u.role === 'engineer')
  const newOrders = orders.filter((o) => o.status === 'new')
  const visibleOrders = orders.filter((order) => {
    const equipmentItem = equipment.find((item) => item.id === order.equipmentId)
    const query = search.trim().toLocaleLowerCase('ru-RU')
    const matchesQuery = !query || [order.orderNumber, order.title, order.description, equipmentItem?.name, equipmentItem?.location]
      .some((value) => value?.toLocaleLowerCase('ru-RU').includes(query))
    return matchesQuery && (priorityFilter === 'all' || order.priority === priorityFilter)
  })
  const locationStats = Array.from(equipment.reduce((map, item) => {
    const current = map.get(item.location) ?? { name: item.location, assets: 0, openOrders: 0 }
    current.assets += 1
    current.openOrders = orders.filter((order) => order.equipmentId === item.id && !['completed', 'closed', 'cancelled'].includes(order.status)).length + current.openOrders
    map.set(item.location, current)
    return map
  }, new Map<string, { name: string; assets: number; openOrders: number }>()).values())
  const statusColumns = [
    { id: 'new' as const, title: t.status.new },
    { id: 'assigned' as const, title: t.status.assigned },
    { id: 'traveling' as const, title: t.status.traveling },
    { id: 'arrived' as const, title: t.status.arrived },
    { id: 'in_progress' as const, title: t.status.inProgress },
    { id: 'completed' as const, title: t.status.completed },
    { id: 'closed' as const, title: t.status.closed },
    { id: 'cancelled' as const, title: t.status.cancelled },
  ]

  const handleOrderClick = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (order && order.status === 'new') {
      setSelectedOrder(orderId)
      setAssignmentForm({
        priority: order.priority,
        deadline: getDefaultDeadline(order.priority),
        assignedTo: '',
      })
    }
  }

  const handleAssignOrder = () => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder, 'assigned', {
        priority: assignmentForm.priority,
        assignedTo: assignmentForm.assignedTo,
        deadline: assignmentForm.deadline,
        assignedAt: new Date().toISOString(),
      })
      setSelectedOrder(null)
      setAssignmentForm({
        priority: 'medium',
        deadline: '',
        assignedTo: '',
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-danger-red/10 text-danger-red'
      case 'high':
        return 'bg-warning-yellow/10 text-warning-yellow'
      case 'medium':
        return 'bg-primary-blue/10 text-primary-blue'
      case 'low':
        return 'bg-success-green/10 text-success-green'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical':
        return t.client.critical
      case 'high':
        return t.client.high
      case 'medium':
        return t.client.medium
      case 'low':
        return t.client.low
      default:
        return priority
    }
  }

  return (
    <div className="flex min-h-screen bg-bg-light-blue">
      <Sidebar role="dispatcher" />

      <main className="flex-1 ml-64 p-8 max-md:ml-0 max-md:p-4 max-md:pt-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-dark-blue">{t.dispatcher.title}</h1>
            <p className="text-text-secondary">{t.dispatcher.subtitle}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-text-secondary text-sm mb-2">{t.dispatcher.totalOrders}</p>
              <p className="text-3xl font-bold text-dark-blue">{orders.length}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-text-secondary text-sm mb-2">{t.dispatcher.newOrders}</p>
              <p className="text-3xl font-bold text-primary-blue">{newOrders.length}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-text-secondary text-sm mb-2">{t.dispatcher.inProgress}</p>
              <p className="text-3xl font-bold text-warning-yellow">
                {orders.filter((o) => o.status === 'in_progress').length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-text-secondary text-sm mb-2">{t.dispatcher.engineers}</p>
              <p className="text-3xl font-bold text-success-green">{engineers.length}</p>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-dark-blue">{t.dispatcher.allOrders}</h2>
              {newOrders.length > 0 && (
                <div className="flex items-center gap-2 text-primary-blue">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">{newOrders.length} {t.dispatcher.newOrdersBadge}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 border-b border-gray-100 px-4 py-3" role="group" aria-label="Вид заявок">
              <button onClick={() => setViewMode('list')} aria-pressed={viewMode === 'list'} className={`min-h-10 rounded-lg px-3 text-sm ${viewMode === 'list' ? 'bg-dark-blue text-white' : 'border border-gray-200 text-text-secondary'}`}>Список</button>
              <button onClick={() => setViewMode('kanban')} aria-pressed={viewMode === 'kanban'} className={`min-h-10 rounded-lg px-3 text-sm ${viewMode === 'kanban' ? 'bg-dark-blue text-white' : 'border border-gray-200 text-text-secondary'}`}>Канбан</button>
              <button onClick={() => setViewMode('map')} aria-pressed={viewMode === 'map'} className={`min-h-10 rounded-lg px-3 text-sm ${viewMode === 'map' ? 'bg-dark-blue text-white' : 'border border-gray-200 text-text-secondary'}`}>Карта объектов</button>
            </div>
            <div className="grid gap-3 border-b border-gray-100 p-4 sm:grid-cols-[1fr_220px]">
              <label className="sr-only" htmlFor="order-search">Поиск заявок</label>
              <input id="order-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Поиск по номеру, оборудованию или объекту" className="min-h-11 rounded-lg border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
              <label className="sr-only" htmlFor="priority-filter">Фильтр по приоритету</label>
              <select id="priority-filter" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} className="min-h-11 rounded-lg border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-primary-blue">
                <option value="all">Все приоритеты</option>
                <option value="critical">Аварийный</option><option value="high">Высокий</option><option value="medium">Средний</option><option value="low">Низкий</option>
              </select>
            </div>
            {viewMode === 'map' ? <div className="relative min-h-[380px] overflow-hidden bg-[#edf4f4] p-5" aria-label="Схема объектов обслуживания">
              <div className="absolute inset-0 opacity-70" aria-hidden="true" style={{ backgroundImage: 'linear-gradient(28deg, transparent 46%, #fff 47%, #fff 50%, transparent 51%), linear-gradient(118deg, transparent 41%, #fff 42%, #fff 45%, transparent 46%), linear-gradient(90deg, rgba(22,105,170,.05) 1px, transparent 1px), linear-gradient(rgba(22,105,170,.05) 1px, transparent 1px)', backgroundSize: '100% 100%, 100% 100%, 32px 32px, 32px 32px' }} />
              <p className="relative z-10 text-sm font-medium text-text-secondary">Демо-схема: нажмите на объект, чтобы отфильтровать заявки.</p>
              {locationStats.map((location, index) => <button key={location.name} onClick={() => { setSearch(location.name); setViewMode('list') }} style={{ left: `${8 + (index * 31) % 78}%`, top: `${18 + (index * 43) % 68}%` }} className="absolute z-10 flex max-w-52 items-center gap-2 rounded-full border border-white bg-white px-3 py-2 text-left text-xs font-semibold text-dark-blue shadow-md hover:border-primary-blue"><MapPin size={16} className="shrink-0 text-primary-blue" /><span>{location.name}<small className="block font-normal text-text-secondary">{location.assets} ед. · {location.openOrders} активных заявок</small></span></button>)}
            </div> : viewMode === 'kanban' ? <div className="flex gap-4 overflow-x-auto p-4">{statusColumns.map((column) => <section key={column.id} className="w-64 shrink-0 rounded-xl bg-gray-50 p-3"><h3 className="mb-3 flex items-center justify-between font-semibold text-dark-blue">{column.title}<span className="rounded-full bg-white px-2 py-1 text-xs text-text-secondary">{visibleOrders.filter((order) => order.status === column.id).length}</span></h3><div className="space-y-3">{visibleOrders.filter((order) => order.status === column.id).map((order) => <button key={order.id} disabled={order.status !== 'new'} title={order.status === 'new' ? 'Открыть назначение инженера' : 'Карточка доступна для просмотра'} onClick={() => handleOrderClick(order.id)} className="w-full rounded-lg border border-gray-200 bg-white p-3 text-left hover:border-primary-blue disabled:cursor-default disabled:hover:border-gray-200"><span className="font-mono text-xs text-text-secondary">{order.orderNumber}</span><span className="mt-1 block text-sm font-semibold text-dark-blue">{order.title}</span><span className="mt-2 block text-xs text-text-secondary">{getPriorityLabel(order.priority)}</span></button>)}</div></section>)}</div> : <div className="divide-y divide-gray-200">
              {visibleOrders.length === 0 ? (
                <div className="p-12 text-center text-text-secondary">
                  {orders.length === 0 ? t.common.noData : 'По заданным условиям заявки не найдены.'}
                </div>
              ) : (
                visibleOrders.map((order) => {
                  const eq = equipment.find((e) => e.id === order.equipmentId)
                  const assignedEngineer = users.find((u) => u.id === order.assignedTo)
                  return (
                    <div
                      key={order.id}
                      onClick={() => handleOrderClick(order.id)}
                      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') handleOrderClick(order.id) }}
                      role={order.status === 'new' ? 'button' : undefined}
                      tabIndex={order.status === 'new' ? 0 : undefined}
                      className={`p-6 hover:bg-gray-50 transition-colors ${order.status === 'new' ? 'cursor-pointer' : 'cursor-default'} ${
                        order.status === 'new' ? 'bg-primary-blue/5 border-l-4 border-l-primary-blue' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-sm text-text-secondary">{order.orderNumber}</span>
                            <StatusBadge status={order.status} />
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                              {getPriorityLabel(order.priority)}
                            </span>
                          </div>
                          <h3 className="font-semibold text-dark-blue mb-1">{order.title}</h3>
                          <p className="text-sm text-text-secondary mb-2">{order.description}</p>
                          <div className="flex items-center gap-4 text-sm text-text-secondary">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {eq?.location || 'Не указано'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        </div>
                        {assignedEngineer && (
                          <div className="flex items-center gap-2 bg-bg-light-blue px-3 py-2 rounded-lg">
                            <User className="w-4 h-4 text-primary-blue" />
                            <span className="text-sm font-medium text-dark-blue">{assignedEngineer.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>}
          </div>
        </div>
      </main>

      {/* Assignment Modal */}
      <Modal
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        title={t.dispatcher.manageOrder}
      >
        {selectedOrder && (() => {
          const order = orders.find((o) => o.id === selectedOrder)
          const eq = equipment.find((e) => e.id === order?.equipmentId)
          return (
            <div className="space-y-6">
              <div className="bg-bg-light-blue rounded-lg p-4">
                <h3 className="font-semibold text-dark-blue mb-2">{order?.title}</h3>
                <p className="text-sm text-text-secondary mb-2">{order?.description}</p>
                <p className="text-sm text-text-secondary">
                  <span className="font-medium">{t.dispatcher.equipment}:</span> {eq?.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">{t.client.priority}</label>
                <select
                  value={assignmentForm.priority}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, priority: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                >
                  <option value="low">{t.client.low}</option>
                  <option value="medium">{t.client.medium}</option>
                  <option value="high">{t.client.high}</option>
                  <option value="critical">{t.client.critical}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">{t.dispatcher.deadline}</label>
                <input
                  type="datetime-local"
                  value={assignmentForm.deadline}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, deadline: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">{t.dispatcher.assignEngineer}</label>
                <select
                  value={assignmentForm.assignedTo}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, assignedTo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  required
                >
                  <option value="">{t.dispatcher.selectEngineer}</option>
                  {engineers.map((eng) => (
                    <option key={eng.id} value={eng.id}>
                      {eng.name} ({eng.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-text-primary font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t.common.cancel}
                </button>
                <button
                  onClick={handleAssignOrder}
                  disabled={!assignmentForm.assignedTo}
                  className="flex-1 px-4 py-3 bg-primary-blue hover:bg-dark-blue text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t.dispatcher.assignEngineer}
                </button>
              </div>
            </div>
          )
        })()}
      </Modal>
    </div>
  )
}
