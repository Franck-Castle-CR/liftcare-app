import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import Sidebar from '../components/Sidebar'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import { Clock, MapPin, User, AlertCircle } from 'lucide-react'

export default function DispatcherDashboard() {
  const { user, orders, equipment, users, updateOrderStatus } = useApp()
  const { t } = useLanguage()
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [assignmentForm, setAssignmentForm] = useState({
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    deadline: '',
    assignedTo: '',
  })

  const engineers = users.filter((u) => u.role === 'engineer')
  const newOrders = orders.filter((o) => o.status === 'new')

  const handleOrderClick = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (order && order.status === 'new') {
      setSelectedOrder(orderId)
      setAssignmentForm({
        priority: order.priority,
        deadline: '',
        assignedTo: '',
      })
    }
  }

  const handleAssignOrder = () => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder, 'assigned', {
        priority: assignmentForm.priority,
        assignedTo: assignmentForm.assignedTo,
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
        return t.dispatcher.criticalPriority
      case 'high':
        return t.dispatcher.highPriority
      case 'medium':
        return t.dispatcher.mediumPriority
      case 'low':
        return t.dispatcher.lowPriority
      default:
        return priority
    }
  }

  return (
    <div className="flex min-h-screen bg-bg-light-blue">
      <Sidebar role="dispatcher" />

      <main className="flex-1 ml-64 p-8">
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
            <div className="divide-y divide-gray-200">
              {orders.length === 0 ? (
                <div className="p-12 text-center text-text-secondary">
                  {t.common.noData}
                </div>
              ) : (
                orders.map((order) => {
                  const eq = equipment.find((e) => e.id === order.equipmentId)
                  const assignedEngineer = users.find((u) => u.id === order.assignedTo)
                  return (
                    <div
                      key={order.id}
                      onClick={() => handleOrderClick(order.id)}
                      className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
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
            </div>
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
                <label className="block text-sm font-medium text-text-primary mb-2">{t.dispatcher.priority}</label>
                <select
                  value={assignmentForm.priority}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, priority: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                >
                  <option value="low">{t.dispatcher.lowPriority}</option>
                  <option value="medium">{t.dispatcher.mediumPriority}</option>
                  <option value="high">{t.dispatcher.highPriority}</option>
                  <option value="critical">{t.dispatcher.criticalPriority}</option>
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
