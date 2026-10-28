import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import Sidebar from '../components/Sidebar'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import { Plus, Calendar, MapPin, Upload, CheckCircle } from 'lucide-react'
import { compressImage } from '../utils/image'
import LanguageSelector from '../components/LanguageSelector'

export default function ClientDashboard() {
  const { user, equipment, orders, createOrder, updateOrderStatus, users, parts } = useApp()
  const { t } = useLanguage()
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showActModal, setShowActModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [rating, setRating] = useState(0)
  const [photoError, setPhotoError] = useState('')
  const [orderForm, setOrderForm] = useState({
    equipmentId: '',
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    photo: null as string | null,
  })

  const userOrders = orders.filter((o) => o.createdBy === user?.id)
  const pendingOrders = userOrders.filter((o) => o.status === 'completed')

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault()
    createOrder({
      ...orderForm,
      status: 'new',
      priority: orderForm.priority,
      createdBy: user!.id,
      photos: orderForm.photo ? [orderForm.photo] : [],
    })
    setShowOrderModal(false)
    setOrderForm({
      equipmentId: '',
      title: '',
      description: '',
      priority: 'medium',
      photo: null,
    })
  }

  const handlePhotoUpload = async (file?: File) => {
    if (!file || !file.type.startsWith('image/')) return
    setPhotoError('')
    try {
      const image = await compressImage(file)
      setOrderForm((current) => ({ ...current, photo: image }))
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : 'Не удалось загрузить фотографию.')
    }
  }

  const handleConfirmAct = () => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder, 'closed', {
        notes: `${t.client.ratingNote}: ${rating} ★`,
        rating,
        confirmedAt: new Date().toISOString(),
      })
      setShowActModal(false)
      setSelectedOrder(null)
      setRating(0)
    }
  }

  const actOrder = orders.find((order) => order.id === selectedOrder)
  const actEquipment = equipment.find((item) => item.id === actOrder?.equipmentId)
  const actEngineer = users.find((item) => item.id === actOrder?.assignedTo)
  const actParts = actOrder?.partsUsed?.map(({ partId, quantity }) => ({ part: parts.find((item) => item.id === partId), quantity })) ?? []

  return (
    <div className="flex min-h-screen bg-bg-light-blue">
      <Sidebar role="client" />

      <main className="flex-1 ml-64 p-8 max-md:ml-0 max-md:p-4 max-md:pt-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-dark-blue">{t.client.title}</h1>
              <p className="text-text-secondary">{t.client.subtitle}</p>
            </div>
            <button
              onClick={() => setShowOrderModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary-blue hover:bg-dark-blue text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              {t.client.createOrder}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-text-secondary text-sm mb-2">{t.client.totalEquipment}</p>
              <p className="text-3xl font-bold text-dark-blue">{equipment.length}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-text-secondary text-sm mb-2">{t.client.activeOrders}</p>
              <p className="text-3xl font-bold text-primary-blue">
                {userOrders.filter((o) => !['completed', 'closed', 'cancelled'].includes(o.status)).length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-text-secondary text-sm mb-2">{t.client.pendingOrders}</p>
              <p className="text-3xl font-bold text-warning-yellow">{pendingOrders.length}</p>
            </div>
          </div>

          {/* Equipment List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-dark-blue">{t.client.myEquipment}</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {equipment.map((eq) => (
                <div key={eq.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-dark-blue mb-2">{eq.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-text-secondary">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {eq.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {t.client.lastMaintenance}: {eq.lastMaintenance || t.client.notPerformed}
                        </span>
                      </div>
                    </div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${eq.status === 'active' ? 'bg-success-green/10 text-success-green' : eq.status === 'broken' ? 'bg-danger-red/10 text-danger-red' : 'bg-warning-yellow/10 text-warning-yellow'}`}>
                      {eq.status === 'active' ? t.ui.equipmentWorking : eq.status === 'broken' ? t.ui.equipmentBroken : t.ui.equipmentMaintenance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-dark-blue">{t.client.myOrders}</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {userOrders.length === 0 ? (
                <div className="p-12 text-center text-text-secondary">
                  {t.client.noOrders}
                </div>
              ) : (
                userOrders.map((order) => (
                  <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm text-text-secondary">{order.orderNumber}</span>
                          <StatusBadge status={order.status} />
                        </div>
                        <h3 className="font-semibold text-dark-blue mb-1">{order.title}</h3>
                        <p className="text-sm text-text-secondary">{order.description}</p>
                      </div>
                      {order.status === 'completed' && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order.id)
                            setShowActModal(true)
                          }}
                          className="px-4 py-2 bg-success-green hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          {t.client.confirmWork}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Create Order Modal */}
      <Modal isOpen={showOrderModal} onClose={() => setShowOrderModal(false)} title={t.client.createOrder}>
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <div className="flex justify-end"><LanguageSelector /></div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">{t.client.equipmentName}</label>
            <select
              value={orderForm.equipmentId}
              onChange={(e) => setOrderForm({ ...orderForm, equipmentId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              required
            >
              <option value="">{t.client.selectEquipment}</option>
              {equipment.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} - {eq.location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">{t.client.orderTitle}</label>
            <input
              type="text"
              value={orderForm.title}
              onChange={(e) => setOrderForm({ ...orderForm, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              placeholder={t.client.orderTitlePlaceholder}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">{t.client.orderDescription}</label>
            <textarea
              value={orderForm.description}
              onChange={(e) => setOrderForm({ ...orderForm, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue min-h-[100px]"
              placeholder={t.client.orderDescriptionPlaceholder}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">{t.client.priority}</label>
            <select
              value={orderForm.priority}
              onChange={(e) => setOrderForm({ ...orderForm, priority: e.target.value as any })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            >
              <option value="low">{t.client.low}</option>
              <option value="medium">{t.client.medium}</option>
              <option value="high">{t.client.high}</option>
              <option value="critical">{t.client.critical}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">{t.client.uploadPhoto}</label>
            {orderForm.photo ? (
              <div className="relative">
                <img src={orderForm.photo} alt={t.client.uploadPhoto} className="w-full h-48 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => setOrderForm({ ...orderForm, photo: null })}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => document.getElementById('client-order-photo')?.click()}
                className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-blue transition-colors flex flex-col items-center gap-2"
              >
                <Upload className="w-8 h-8 text-text-secondary" />
                <span className="text-sm text-text-secondary">{t.client.uploadPhotoBtn}</span>
              </button>
            )}
            <input id="client-order-photo" type="file" accept="image/*" capture="environment" className="sr-only" onChange={(event) => handlePhotoUpload(event.target.files?.[0])} />
            {photoError && <p role="alert" className="mt-2 text-sm text-danger-red">{photoError}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowOrderModal(false)}
              className="flex-1 px-4 py-3 border border-gray-200 text-text-primary font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary-blue hover:bg-dark-blue text-white font-medium rounded-lg transition-colors"
            >
              {t.common.save}
            </button>
          </div>
        </form>
      </Modal>

      {/* Electronic Act Modal */}
      <Modal isOpen={showActModal} onClose={() => setShowActModal(false)} title={t.client.workCompleted}>
        <div className="space-y-6">
          <article className="bg-white border border-gray-200 rounded-lg p-5 space-y-3 text-sm" id="electronic-act">
            <div className="flex justify-between gap-4"><h3 className="font-bold text-dark-blue text-lg">{t.ui.actTitle}</h3><span className="font-mono">{actOrder?.orderNumber}</span></div>
            <p><strong>{t.ui.date}:</strong> {actOrder?.completedAt ? new Date(actOrder.completedAt).toLocaleString() : '—'}</p>
            <p><strong>{t.ui.client}:</strong> {user?.name}</p>
            <p><strong>{t.ui.siteEquipment}:</strong> {actEquipment?.location} · {actEquipment?.name}</p>
            <p><strong>{t.ui.fault}:</strong> {actOrder?.title} — {actOrder?.description}</p>
            <p><strong>{t.ui.diagnosisWork}:</strong> {actOrder?.diagnosis || actOrder?.notes || '—'}</p>
            <p><strong>{t.ui.engineer}:</strong> {actEngineer?.name ?? '—'}</p>
            <p><strong>{t.ui.workTimes}:</strong> {actOrder?.startedAt ? new Date(actOrder.startedAt).toLocaleString() : '—'} · {actOrder?.completedAt ? new Date(actOrder.completedAt).toLocaleString() : '—'}</p>
            <p><strong>{t.ui.spareParts}:</strong> {actParts.length ? actParts.map(({ part, quantity }) => `${part?.name ?? '—'} × ${quantity}`).join(', ') : t.ui.noParts}</p>
            <p><strong>{t.ui.engineerSignature}:</strong> {actEngineer?.name ?? '—'}</p>
            <p><strong>{t.ui.clientSignature}:</strong> {t.ui.clientSignatureHint}</p>
            {actOrder?.photos?.[0] && <img src={actOrder.photos[0]} alt="Фото результата ремонта" className="max-h-48 rounded-lg object-cover" />}
          </article>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => window.print()} className="min-h-11 px-4 border border-gray-200 rounded-lg hover:bg-gray-50">{t.ui.printPdf}</button>
            <button type="button" onClick={() => { const subject = encodeURIComponent(`${t.ui.actTitle} ${actOrder?.orderNumber}`); const body = encodeURIComponent(`${t.ui.actTitle} ${actOrder?.orderNumber} · LiftCare.`); window.location.href = `mailto:${user?.email}?subject=${subject}&body=${body}` }} className="min-h-11 px-4 border border-gray-200 rounded-lg hover:bg-gray-50">{t.ui.sendClient}</button>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">{t.client.rateQuality}</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  aria-label={`${t.client.rateQuality}: ${star}/5`}
                  aria-pressed={star === rating}
                  className={`p-2 text-2xl transition-colors ${star <= rating ? 'text-warning-yellow' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowActModal(false)}
              className="flex-1 px-4 py-3 border border-gray-200 text-text-primary font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t.common.cancel}
            </button>
            <button
              onClick={handleConfirmAct}
              disabled={rating === 0}
              className="flex-1 px-4 py-3 bg-success-green hover:bg-green-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              {t.client.confirmWork}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
