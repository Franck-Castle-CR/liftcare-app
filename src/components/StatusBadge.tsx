import type { OrderStatus } from '../types'
import { useLanguage } from '../context/LanguageContext'

interface StatusBadgeProps {
  status: OrderStatus
}

const statusConfig: Record<OrderStatus, { bgColor: string; textColor: string }> = {
  new: { bgColor: 'bg-primary-blue/10', textColor: 'text-primary-blue' },
  assigned: { bgColor: 'bg-light-blue/10', textColor: 'text-light-blue' },
  traveling: { bgColor: 'bg-light-blue/10', textColor: 'text-light-blue' },
  arrived: { bgColor: 'bg-warning-yellow/10', textColor: 'text-warning-yellow' },
  in_progress: { bgColor: 'bg-warning-yellow/10', textColor: 'text-warning-yellow' },
  completed: { bgColor: 'bg-warning-yellow/10', textColor: 'text-warning-yellow' },
  closed: { bgColor: 'bg-success-green/10', textColor: 'text-success-green' },
  cancelled: { bgColor: 'bg-danger-red/10', textColor: 'text-danger-red' },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useLanguage()
  const config = statusConfig[status]
  const labels: Record<OrderStatus, string> = {
    new: t.status.new,
    assigned: t.status.assigned,
    traveling: t.status.traveling,
    arrived: t.status.arrived,
    in_progress: t.status.inProgress,
    completed: t.status.completed,
    closed: t.status.closed,
    cancelled: t.status.cancelled,
  }
  const label = labels[status]

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      {label}
    </span>
  )
}
