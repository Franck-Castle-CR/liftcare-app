import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import Sidebar from '../components/Sidebar'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import { MapPin, Clock, QrCode, CheckCircle, Upload, AlertCircle } from 'lucide-react'

export default function EngineerDashboard() {
  const { user, orders, equipment, parts, updateOrderStatus, decrementPartStock } = useApp()
  const { t } = useLanguage()
  const [showPassportModal, setShowPassportModal] = useState(false)
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [checklist, setChecklist] = useState<string[]>([])
  const [diagnosis, setDiagnosis] = useState('')
  const [selectedPart, setSelectedPart] = useState('')
  const [photo, setPhoto] = useState<string | null>(null)

  const checklistItems = [
    t.engineer.checklistItems.visual,
    t.engineer.checklistItems.safety,
    t.engineer.checklistItems.electrical,
    t.engineer.checklistItems.functional,
    t.engineer.checklistItems.sensors,
    t.engineer.checklistItems.lubrication,
  ]

  const myOrders = orders.filter((o) => o.assignedTo === user?.id && o.status !== 'completed' && o.status !== 'cancelled')
  const activeOrder = myOrders.find((o) => o.status === 'in_progress' || o.status === 'assigned')

  const handleStartTrip = () => {
    if (activeOrder) {
      updateOrderStatus(activeOrder.id, 'in_progress')
    }
  }

  const handleScanQR = (equipmentId: string) => {
    setSelectedEquipment(equipmentId)
    setShowPassportModal(true)
  }

  const handleDiagnosis = () => {
    setShowDiagnosisModal(true)
  }

  const handleCompleteDiagnosis = () => {
    if (selectedOrder && checklist.length === checklistItems.length && diagnosis) {
      updateOrderStatus(selectedOrder, 'in_progress', {
        diagnosis,
      })
      setShowDiagnosisModal(false)
    }
  }

  const handlePartSelection = (partId: string) => {
    setSelectedPart(partId)
    decrementPartStock(partId, 1)
  }

  const handlePhotoUpload = () => {
    const fakePhoto = 'https://via.placeholder.com/400x300/16A34A/ffffff?text=Фото+результата'
    setPhoto(fakePhoto)
  }

  const handleCompleteWork = () => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder, 'completed', {
        partsUsed: selectedPart ? [{ partId: selectedPart, quantity: 1 }] : [],
        photos: photo ? [photo] : [],
        notes: 'Работа выполнена, ожидает подтверждения клиента',
      })
      setSelectedOrder(null)
      setPhoto(null)
      setSelectedPart('')
    }
  }

  const handleToggleChecklist = (item: string) => {
    setChecklist((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    )
  }

  return (
    <div className="flex min-h-screen bg-bg-light-blue">
      <Sidebar role="engineer" />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-dark-blue">Панель инженера</h1>
            <p className="text-text-secondary">Управление ремонтными работами</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-text-secondary text-sm mb-2">Назначено заявок</p>
              <p className="text-3xl font-bold text-dark-blue">{myOrders.length}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-text-secondary text-sm mb-2">В работе</p>
              <p className="text-3xl font-bold text-warning-yellow">
                {myOrders.filter((o) => o.status === 'in_progress').length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <p className="text-text-secondary text-sm mb-2">Выполнено сегодня</p>
              <p className="text-3xl font-bold text-success-green">
                {orders.filter((o) => o.assignedTo === user?.id && o.status === 'completed').length}
              </p>
            </div>
          </div>

          {/* Active Order */}
          {activeOrder ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-dark-blue">Активное задание</h2>
                  <StatusBadge status={activeOrder.status} />
                </div>
                <div className="space-y-2">
                  <p className="font-mono text-sm text-text-secondary">{activeOrder.orderNumber}</p>
                  <h3 className="font-semibold text-dark-blue">{activeOrder.title}</h3>
                  <p className="text-text-secondary">{activeOrder.description}</p>
                </div>
              </div>

              <div className="p-6">
                {/* Step 1: Start Trip */}
                {activeOrder.status === 'assigned' && (
                  <button
                    onClick={handleStartTrip}
                    className="w-full py-4 bg-primary-blue hover:bg-dark-blue text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Clock className="w-5 h-5" />
                    Начать поездку
                  </button>
                )}

                {/* Step 2: Arrived & QR Scan */}
                {activeOrder.status === 'in_progress' && !activeOrder.diagnosis && (
                  <div className="space-y-4">
                    <button
                      onClick={() => setSelectedOrder(activeOrder.id)}
                      className="w-full py-4 bg-success-green hover:bg-green-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Прибыл на объект
                    </button>
                    <button
                      onClick={() => handleScanQR(activeOrder.equipmentId)}
                      className="w-full py-4 bg-light-blue hover:bg-primary-blue text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <QrCode className="w-5 h-5" />
                      Сканировать QR-код оборудования
                    </button>
                  </div>
                )}

                {/* Step 3: Diagnosis */}
                {activeOrder.status === 'in_progress' && activeOrder.diagnosis && !activeOrder.partsUsed && (
                  <button
                    onClick={handleDiagnosis}
                    className="w-full py-4 bg-warning-yellow hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-5 h-5" />
                    Начать диагностику
                  </button>
                )}

                {/* Step 4: Parts */}
                {activeOrder.status === 'in_progress' && activeOrder.diagnosis && !activeOrder.photos && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Выберите использованную запчасть</label>
                      <select
                        value={selectedPart}
                        onChange={(e) => handlePartSelection(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      >
                        <option value="">Не требуется</option>
                        {parts.map((part) => (
                          <option key={part.id} value={part.id} disabled={part.stock === 0}>
                            {part.name} (Остаток: {part.stock} {part.unit})
                          </option>
                        ))}
                      </select>
                    </div>
                    {selectedPart && (
                      <p className="text-sm text-success-green flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Запчасть списана со склада
                      </p>
                    )}
                  </div>
                )}

                {/* Step 5: Complete */}
                {activeOrder.status === 'in_progress' && activeOrder.diagnosis && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Фото результата</label>
                      {photo ? (
                        <div className="relative">
                          <img src={photo} alt="Result" className="w-full h-48 object-cover rounded-lg" />
                          <button
                            onClick={() => setPhoto(null)}
                            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={handlePhotoUpload}
                          className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-blue transition-colors flex flex-col items-center gap-2"
                        >
                          <Upload className="w-8 h-8 text-text-secondary" />
                          <span className="text-sm text-text-secondary">Загрузить фото</span>
                        </button>
                      )}
                    </div>
                    <button
                      onClick={handleCompleteWork}
                      disabled={!photo}
                      className="w-full py-4 bg-success-green hover:bg-green-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Завершить работу
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-text-secondary">Нет активных заданий</p>
            </div>
          )}

          {/* Other Orders */}
          {myOrders.length > 1 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-dark-blue">Другие заявки</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {myOrders
                  .filter((o) => o.id !== activeOrder?.id)
                  .map((order) => (
                    <div key={order.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-mono text-sm text-text-secondary mb-1">{order.orderNumber}</p>
                          <h3 className="font-semibold text-dark-blue">{order.title}</h3>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Equipment Passport Modal */}
      <Modal
        isOpen={showPassportModal}
        onClose={() => setShowPassportModal(false)}
        title="Цифровой паспорт оборудования"
      >
        {selectedEquipment && (() => {
          const eq = equipment.find((e) => e.id === selectedEquipment)
          return (
            <div className="space-y-6">
              <div className="bg-bg-light-blue rounded-lg p-6">
                <h3 className="font-bold text-dark-blue text-xl mb-2">{eq?.name}</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <span className="text-text-secondary">Тип:</span>
                    <span className="font-medium text-dark-blue">{eq?.type}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-text-secondary" />
                    <span className="font-medium text-dark-blue">{eq?.location}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-text-secondary" />
                    <span className="font-medium text-dark-blue">Установлен: {eq?.installationDate}</span>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-dark-blue mb-3">История ремонтов</h4>
                {eq?.repairHistory && eq.repairHistory.length > 0 ? (
                  <div className="space-y-3">
                    {eq.repairHistory.map((repair, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-text-secondary mb-1">{repair.date}</p>
                        <p className="font-medium text-dark-blue mb-1">{repair.description}</p>
                        <p className="text-sm text-text-secondary">Стоимость: {repair.cost.toLocaleString()} ₸</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm">История ремонтов пуста</p>
                )}
              </div>

              <button
                onClick={() => setShowPassportModal(false)}
                className="w-full py-3 bg-primary-blue hover:bg-dark-blue text-white font-medium rounded-lg transition-colors"
              >
                Закрыть
              </button>
            </div>
          )
        })()}
      </Modal>

      {/* Diagnosis Modal */}
      <Modal
        isOpen={showDiagnosisModal}
        onClose={() => setShowDiagnosisModal(false)}
        title="Диагностика оборудования"
      >
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-dark-blue mb-3">Чек-лист диагностики</h4>
            <div className="space-y-2">
              {checklistItems.map((item) => (
                <label key={item} className="flex items-center gap-3 p-3 bg-bg-light-blue rounded-lg cursor-pointer hover:bg-white transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.includes(item)}
                    onChange={() => handleToggleChecklist(item)}
                    className="w-5 h-5 text-primary-blue rounded"
                  />
                  <span className="text-sm text-dark-blue">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Причина неисправности</label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue min-h-[100px]"
              placeholder="Опишите выявленную проблему..."
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowDiagnosisModal(false)}
              className="flex-1 px-4 py-3 border border-gray-200 text-text-primary font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleCompleteDiagnosis}
              disabled={checklist.length !== checklistItems.length || !diagnosis}
              className="flex-1 px-4 py-3 bg-primary-blue hover:bg-dark-blue text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Завершить диагностику
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
