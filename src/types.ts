export type UserRole = 'client' | 'dispatcher' | 'engineer' | 'manager'

export type OrderStatus = 'new' | 'assigned' | 'traveling' | 'arrived' | 'in_progress' | 'completed' | 'closed' | 'cancelled'

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: UserRole
  phone?: string
}

export interface RepairHistory {
  date: string
  description: string
  engineerId: string
  cost: number
}

export interface Equipment {
  id: string
  name: string
  type: string
  status: 'active' | 'maintenance' | 'broken'
  location: string
  qrCode: string
  installationDate: string
  lastMaintenance?: string
  nextMaintenance?: string
  repairHistory: RepairHistory[]
}

export interface Part {
  id: string
  name: string
  manufacturer?: string
  warehouse?: string
  compatibleEquipment?: string[]
  stock: number
  unit: string
  minStock: number
  price: number
}

export interface Order {
  id: string
  orderNumber: string
  title: string
  description: string
  equipmentId: string
  status: OrderStatus
  priority: 'low' | 'medium' | 'high' | 'critical'
  createdBy: string
  createdAt: string
  assignedTo?: string
  assignedAt?: string
  deadline?: string
  tripStartedAt?: string
  arrivedAt?: string
  qrScannedAt?: string
  checklist?: string[]
  rating?: number
  confirmedAt?: string
  startedAt?: string
  completedAt?: string
  diagnosis?: string
  partsUsed?: Array<{ partId: string; quantity: number }>
  photos?: string[]
  notes?: string
}
