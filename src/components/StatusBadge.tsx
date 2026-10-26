import type { OrderStatus } from '../types'
import { useLanguage } from '../context/LanguageContext'

interface StatusBadgeProps {
  status: OrderStatus
}

const statusConfig: Record<OrderStatus, { bgColor: string; textColor: string }> = {
  new: { bgColor: 'bg-primary-blue/10', textColor: 'text-primary-blue' },
  assigned: { bgColor: 'bg-light-blue/10', textColor: 'text-light-blue' },
  in_progress: { bgColor: 'bg-warning-yellow/10', textColor: 'text-warning-yellow' },
  completed: { bgColor: 'bg-success-green/10', textColor: 'text-success-green' },
  cancelled: { bgColor: 'bg-danger-red/10', textColor: 'text-danger-red' },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useLanguage()
  const config = statusConfig[status]
  const label = t.status[status]

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      {label}
    </span>
  )
}
