import { useState } from 'react'
import { CheckCircle, Clock, MapPin, QrCode, Wrench } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useApp } from '../context/AppContext'
import Sidebar from '../components/Sidebar'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import { compressImage } from '../utils/image'
import { useLanguage } from '../context/LanguageContext'

const isoNow = () => new Date().toISOString()

const checklistItems = [
  'Визуальный осмотр оборудования',
  'Проверка устройств безопасности',
  'Проверка электрических соединений',
  'Проверка рабочего режима',
  'Проверка датчиков и концевиков',
  'Проверка смазки и механических узлов',
]

export default function EngineerDashboard() {
  const { user, orders, equipment, parts, updateOrderStatus, decrementPartStock } = useApp()
  const { t } = useLanguage()
  const [showPassport, setShowPassport] = useState(false)
  const [showDiagnosis, setShowDiagnosis] = useState(false)
  const [selectedPart, setSelectedPart] = useState('')
  const [photo, setPhoto] = useState<string | null>(null)
  const [photoError, setPhotoError] = useState('')
  const myOrders = orders.filter((order) => order.assignedTo === user?.id && !['closed', 'cancelled'].includes(order.status))
  const activeOrder = myOrders.find((order) => ['assigned', 'traveling', 'arrived', 'in_progress'].includes(order.status))
  const activeEquipment = equipment.find((item) => item.id === activeOrder?.equipmentId)
  const [diagnosis, setDiagnosis] = useState('')
  const [checkedItems, setCheckedItems] = useState<string[] | null>(null)
  const savedChecklist = activeOrder?.checklist ?? []
  const selectedChecklist = checkedItems ?? savedChecklist
  const selectedPartId = selectedPart || activeOrder?.partsUsed?.[0]?.partId || ''

  const toggleChecklistItem = (item: string) => {
    const next = selectedChecklist.includes(item)
      ? selectedChecklist.filter((entry) => entry !== item)
      : [...selectedChecklist, item]
    setCheckedItems(next)
    if (activeOrder) updateOrderStatus(activeOrder.id, activeOrder.status, { checklist: next })
  }

  const choosePart = (partId: string) => {
    setSelectedPart(partId)
    if (activeOrder) updateOrderStatus(activeOrder.id, activeOrder.status, { partsUsed: partId ? [{ partId, quantity: 1 }] : [] })
  }

  const readPhoto = async (file?: File) => {
    if (!file) return
    setPhotoError('')
    try {
      const uploadedPhoto = await compressImage(file)
      setPhoto(uploadedPhoto)
      if (activeOrder) updateOrderStatus(activeOrder.id, activeOrder.status, { photos: [uploadedPhoto] })
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : 'Не удалось загрузить фотографию.')
    }
  }

  const openDiagnosis = () => {
    setDiagnosis(activeOrder?.diagnosis ?? '')
    setCheckedItems(activeOrder?.checklist ?? [])
    setShowDiagnosis(true)
  }

  const saveDiagnosis = () => {
    if (!activeOrder || !diagnosis.trim() || selectedChecklist.length !== checklistItems.length) return
    updateOrderStatus(activeOrder.id, 'in_progress', { diagnosis: diagnosis.trim(), checklist: selectedChecklist })
    setShowDiagnosis(false)
  }

  const annulDiagnosis = () => {
    if (!activeOrder || !window.confirm(t.ui.annulConfirm)) return
    updateOrderStatus(activeOrder.id, 'in_progress', { diagnosis: undefined, checklist: [] })
    setDiagnosis('')
    setCheckedItems([])
  }

  const finishWork = () => {
    const resultPhoto = photo ?? activeOrder?.photos?.[0]
    if (!activeOrder || !resultPhoto) return
    if (selectedPartId) {
      const part = parts.find((item) => item.id === selectedPartId)
      if (!part || part.stock < 1) return
      decrementPartStock(selectedPartId, 1)
    }
    updateOrderStatus(activeOrder.id, 'completed', {
      partsUsed: selectedPartId ? [{ partId: selectedPartId, quantity: 1 }] : [],
      photos: [resultPhoto],
      notes: 'Работа выполнена. Акт сформирован и ожидает подтверждения клиента.',
    })
    setPhoto(null)
    setSelectedPart('')
  }

  return (
    <div className="flex min-h-screen bg-bg-light-blue">
      <Sidebar role="engineer" />
      <main className="flex-1 ml-64 p-8 max-md:ml-0 max-md:p-4 max-md:pt-16">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <p className="text-sm text-primary-blue font-semibold mb-2">{t.ui.dashboardMobile}</p>
            <h1 className="text-3xl font-bold text-dark-blue">{t.engineer.title}</h1>
            <p className="text-text-secondary mt-1">{t.ui.engineerSubtitle}</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8" aria-label={t.ui.summary}>
            <Kpi label={t.engineer.assignedOrders} value={myOrders.length} />
            <Kpi label={t.engineer.inProgress} value={myOrders.filter((order) => ['traveling', 'arrived', 'in_progress'].includes(order.status)).length} />
            <Kpi label={t.engineer.completedToday} value={orders.filter((order) => order.assignedTo === user?.id && ['completed', 'closed'].includes(order.status)).length} />
          </section>

          {activeOrder ? (
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <span className="font-mono text-sm text-text-secondary">{activeOrder.orderNumber}</span>
                  <StatusBadge status={activeOrder.status} />
                </div>
                <h2 className="text-xl font-bold text-dark-blue">{activeOrder.title}</h2>
                <p className="text-text-secondary mt-2">{activeOrder.description}</p>
                {activeEquipment && <p className="flex items-center gap-2 text-sm text-text-secondary mt-4"><MapPin size={16} />{activeEquipment.name} · {activeEquipment.location}</p>}
              </div>

              <div className="p-6 space-y-5">
                <ol className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs" aria-label={t.ui.stages}>
                  {[t.ui.trip, t.ui.arrival, t.ui.passportStep, t.ui.diagnosisStep, t.ui.actStep].map((step, index) => {
                    const reached = [
                      ['traveling', 'arrived', 'in_progress', 'completed', 'closed'],
                      ['arrived', 'in_progress', 'completed', 'closed'],
                      ['in_progress', 'completed', 'closed'],
                      ['in_progress', 'completed', 'closed'],
                      ['completed', 'closed'],
                    ][index].includes(activeOrder.status)
                    return <li key={step} className={`rounded-lg p-3 text-center ${reached ? 'bg-primary-blue/10 text-primary-blue font-semibold' : 'bg-gray-50 text-text-secondary'}`}>{step}</li>
                  })}
                </ol>

                {activeOrder.status === 'assigned' && <ActionButton onClick={() => updateOrderStatus(activeOrder.id, 'traveling', { tripStartedAt: isoNow() })} icon={<Clock size={19} />}>{t.ui.startTrip}</ActionButton>}
                {activeOrder.status === 'traveling' && <ActionButton onClick={() => updateOrderStatus(activeOrder.id, 'arrived', { arrivedAt: isoNow() })} icon={<MapPin size={19} />}>{t.ui.markArrival}</ActionButton>}
                {activeOrder.status === 'arrived' && (
                  <div className="space-y-3">
                  <button onClick={() => { updateOrderStatus(activeOrder.id, 'arrived', { qrScannedAt: isoNow() }); setShowPassport(true) }} className="w-full min-h-12 py-3 bg-light-blue hover:bg-primary-blue text-white font-medium rounded-lg flex items-center justify-center gap-2"><QrCode size={19} />{t.ui.scanQr}</button>
                    {activeOrder.qrScannedAt && <ActionButton onClick={openDiagnosis} icon={<Wrench size={19} />}>{t.ui.startDiagnosis}</ActionButton>}
                  </div>
                )}
                {activeOrder.status === 'in_progress' && !activeOrder.diagnosis && <ActionButton onClick={openDiagnosis} icon={<Wrench size={19} />}>{t.ui.continueDiagnosis}</ActionButton>}

                {activeOrder.status === 'in_progress' && activeOrder.diagnosis && (
                  <div className="space-y-5 border-t border-gray-100 pt-5">
                    <div className="rounded-lg bg-bg-light-blue p-4">
                      <h3 className="font-semibold text-dark-blue mb-1">{t.ui.resultDiagnosis}</h3>
                      <p className="text-sm text-text-secondary">{activeOrder.diagnosis}</p>
                      <button onClick={openDiagnosis} className="text-sm text-primary-blue font-medium mt-2 underline">{t.ui.editDiagnosis}</button>
                      <button onClick={annulDiagnosis} className="block text-sm text-danger-red font-medium mt-2 underline">{t.ui.annulDiagnosis}</button>
                    </div>
                    <div>
                      <label htmlFor="part-select" className="block text-sm font-medium text-text-primary mb-2">{t.ui.usedPart}</label>
                      <select id="part-select" value={selectedPartId} onChange={(event) => choosePart(event.target.value)} className="w-full min-h-12 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue">
                        <option value="">{t.ui.notUsed}</option>
                        {parts.map((part) => <option key={part.id} value={part.id} disabled={part.stock < 1}>{part.name} · {t.ui.inventoryPart} {part.stock} {part.unit}</option>)}
                      </select>
                      <p className="text-xs text-text-secondary mt-1">{t.ui.inventoryNote}</p>
                    </div>
                    <div>
                      <label htmlFor="result-photo" className="block text-sm font-medium text-text-primary mb-2">{t.ui.resultPhoto}</label>
                      <input id="result-photo" type="file" accept="image/*" capture="environment" onChange={(event) => readPhoto(event.target.files?.[0])} className="block w-full text-sm text-text-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-primary-blue file:px-4 file:py-3 file:text-white" />
                      {photoError && <p role="alert" className="mt-2 text-sm text-danger-red">{photoError}</p>}
                      {(photo ?? activeOrder.photos?.[0]) && <img src={photo ?? activeOrder.photos?.[0]} alt="Фото выполненной работы" className="mt-3 max-h-56 rounded-lg object-cover" />}
                    </div>
                    <ActionButton onClick={finishWork} disabled={!photo && !activeOrder.photos?.[0]} icon={<CheckCircle size={19} />}>{t.ui.finishAndAct}</ActionButton>
                  </div>
                )}
              </div>
            </section>
          ) : <div className="bg-white rounded-xl p-12 text-center border border-gray-200 text-text-secondary">{t.ui.noActiveTask}</div>}

          {myOrders.some((order) => order.status === 'completed') && <section className="mt-8 bg-white rounded-xl border border-gray-200 p-6"><h2 className="font-bold text-dark-blue mb-3">{t.ui.actsAwaiting}</h2><div className="space-y-3">{myOrders.filter((order) => order.status === 'completed').map((order) => <div key={order.id} className="flex items-center justify-between gap-3"><span>{order.orderNumber} · {order.title}</span><StatusBadge status={order.status} /></div>)}</div></section>}

          <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6"><h2 className="font-bold text-dark-blue mb-3">{t.ui.otherAssignments}</h2>{myOrders.filter((order) => order.id !== activeOrder?.id).map((order) => <div key={order.id} className="flex items-center justify-between gap-4 py-3 border-t border-gray-100"><span>{order.orderNumber} · {order.title}</span><StatusBadge status={order.status} /></div>)}</div>
        </div>
      </main>

      <Modal isOpen={showPassport} onClose={() => setShowPassport(false)} title={t.engineer.equipmentPassport}>
        {activeEquipment ? <div className="space-y-5">
          <div className="flex flex-col sm:flex-row gap-5 items-center bg-bg-light-blue rounded-lg p-5">
            <QRCodeSVG value={activeEquipment.qrCode} size={128} title={`QR-код ${activeEquipment.name}`} />
            <div><h3 className="text-lg font-bold text-dark-blue">{activeEquipment.name}</h3><p className="text-sm text-text-secondary mt-1">{activeEquipment.location}</p><p className="text-sm text-text-secondary mt-2">{t.ui.installed}: {activeEquipment.installationDate}</p><p className="text-sm text-text-secondary">{t.ui.nextMaintenance}: {activeEquipment.nextMaintenance ?? t.ui.noScheduledMaintenance}</p></div>
          </div>
          <div><h4 className="font-semibold text-dark-blue mb-2">{t.ui.maintenanceHistory}</h4>{activeEquipment.repairHistory.length ? activeEquipment.repairHistory.map((item, index) => <p key={`${item.date}-${index}`} className="py-2 border-b border-gray-100 text-sm">{item.date} · {item.description} · {item.cost.toLocaleString('ru-RU')} ₸</p>) : <p className="text-sm text-text-secondary">{t.ui.emptyRepairHistory}</p>}</div>
          <button onClick={() => setShowPassport(false)} className="w-full min-h-12 rounded-lg bg-primary-blue hover:bg-dark-blue text-white font-medium">{t.ui.closePassport}</button>
        </div> : <p>{t.ui.noEquipment}</p>}
      </Modal>

      <Modal isOpen={showDiagnosis} onClose={() => setShowDiagnosis(false)} title={t.ui.diagnosisTitle}>
        <div className="space-y-5">
          <div><h3 className="font-semibold text-dark-blue mb-3">{t.ui.checklist}</h3><div className="space-y-2">{checklistItems.map((item, index) => { const label = [t.engineer.checklistItems.visual, t.engineer.checklistItems.safety, t.engineer.checklistItems.electrical, t.engineer.checklistItems.functional, t.engineer.checklistItems.sensors, t.engineer.checklistItems.lubrication][index]; return <label key={item} className="min-h-12 flex items-center gap-3 rounded-lg bg-bg-light-blue px-3 py-2"><input type="checkbox" checked={selectedChecklist.includes(item)} onChange={() => toggleChecklistItem(item)} className="w-5 h-5 accent-primary-blue" /><span className="text-sm text-dark-blue">{label}</span></label> })}</div></div>
          <div><label htmlFor="diagnosis-text" className="block text-sm font-medium text-text-primary mb-2">{t.ui.faultCause}</label><textarea id="diagnosis-text" value={diagnosis} onChange={(event) => setDiagnosis(event.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue min-h-28" placeholder={t.ui.diagnosisPlaceholder} /></div>
          <p className="text-sm text-text-secondary">{t.ui.checklistProgress} {selectedChecklist.length} {t.ui.checklistOf} {checklistItems.length} {t.ui.checklistItems}.</p>
          <button onClick={saveDiagnosis} disabled={selectedChecklist.length !== checklistItems.length || !diagnosis.trim()} className="w-full min-h-12 rounded-lg bg-primary-blue hover:bg-dark-blue disabled:opacity-50 text-white font-medium">{t.ui.saveDiagnosis}</button>
        </div>
      </Modal>
    </div>
  )
}

function Kpi({ label, value }: { label: string; value: number }) {
  return <div className="bg-white rounded-xl p-5 border border-gray-200"><p className="text-sm text-text-secondary">{label}</p><p className="text-3xl font-bold text-dark-blue mt-2">{value}</p></div>
}

function ActionButton({ onClick, icon, children, disabled = false }: { onClick: () => void; icon: React.ReactNode; children: React.ReactNode; disabled?: boolean }) {
  return <button onClick={onClick} disabled={disabled} className="w-full min-h-12 py-3 bg-primary-blue hover:bg-dark-blue disabled:opacity-50 text-white font-medium rounded-lg flex items-center justify-center gap-2"><span aria-hidden="true">{icon}</span>{children}</button>
}
