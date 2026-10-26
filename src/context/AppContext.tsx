import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { UserRole, OrderStatus, User, RepairHistory, Equipment, Part, Order } from '../types'

// Re-export types for convenience
export type { UserRole, OrderStatus, User, RepairHistory, Equipment, Part, Order }

interface AppContextType {
  // State
  user: User | null
  users: User[]
  equipment: Equipment[]
  parts: Part[]
  orders: Order[]

  // Actions
  login: (email: string, password: string) => boolean
  logout: () => void
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, additionalData?: Partial<Order>) => void
  decrementPartStock: (partId: string, quantity: number) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Initial test data
const initialUsers: User[] = [
  {
    id: '1',
    email: 'client@liftcare.kz',
    password: 'demo123',
    name: 'Иван Петров',
    role: 'client',
    phone: '+7 777 123 4567',
  },
  {
    id: '2',
    email: 'dispatcher@liftcare.kz',
    password: 'demo123',
    name: 'Али Смагулов',
    role: 'dispatcher',
    phone: '+7 777 234 5678',
  },
  {
    id: '3',
    email: 'engineer@liftcare.kz',
    password: 'demo123',
    name: 'Сергей Иванов',
    role: 'engineer',
    phone: '+7 777 345 6789',
  },
  {
    id: '4',
    email: 'manager@liftcare.kz',
    password: 'demo123',
    name: 'Дмитрий Козлов',
    role: 'manager',
    phone: '+7 777 456 7890',
  },
]

const initialEquipment: Equipment[] = [
  {
    id: 'EQ-001',
    name: 'Лифт пассажирский Otis',
    type: 'elevator',
    status: 'active',
    location: 'ЖК "Солнечный", корпус 1',
    qrCode: 'https://liftcare.kz/equipment/EQ-001',
    installationDate: '2020-05-15',
    lastMaintenance: '2024-09-15',
    nextMaintenance: '2024-12-15',
    repairHistory: [
      {
        date: '2024-06-10',
        description: 'Замена тормозных колодок',
        engineerId: '3',
        cost: 45000,
      },
    ],
  },
  {
    id: 'EQ-002',
    name: 'Эскалатор KONE',
    type: 'escalator',
    status: 'active',
    location: 'ТЦ "Астана", этаж 1-2',
    qrCode: 'https://liftcare.kz/equipment/EQ-002',
    installationDate: '2019-03-20',
    lastMaintenance: '2024-10-01',
    nextMaintenance: '2025-01-01',
    repairHistory: [
      {
        date: '2024-04-15',
        description: 'Смазка цепей',
        engineerId: '3',
        cost: 15000,
      },
    ],
  },
  {
    id: 'EQ-003',
    name: 'Башенный кран Kroll K-100',
    type: 'crane',
    status: 'maintenance',
    location: 'Стройка "Мегаполис"',
    qrCode: 'https://liftcare.kz/equipment/EQ-003',
    installationDate: '2021-08-10',
    lastMaintenance: '2024-09-20',
    nextMaintenance: '2024-11-20',
    repairHistory: [],
  },
  {
    id: 'EQ-004',
    name: 'Промышленный чиллер Daikin',
    type: 'chiller',
    status: 'active',
    location: 'Завод "Металлург", цех 3',
    qrCode: 'https://liftcare.kz/equipment/EQ-004',
    installationDate: '2020-11-25',
    lastMaintenance: '2024-09-25',
    nextMaintenance: '2024-12-25',
    repairHistory: [
      {
        date: '2024-07-08',
        description: 'Замена фильтров',
        engineerId: '3',
        cost: 25000,
      },
    ],
  },
  {
    id: 'EQ-005',
    name: 'Лифт грузовой Schindler',
    type: 'elevator',
    status: 'broken',
    location: 'Склад "Логистик", рампа 2',
    qrCode: 'https://liftcare.kz/equipment/EQ-005',
    installationDate: '2018-07-30',
    lastMaintenance: '2024-08-30',
    nextMaintenance: '2024-11-30',
    repairHistory: [
      {
        date: '2024-05-20',
        description: 'Капитальный ремонт',
        engineerId: '3',
        cost: 150000,
      },
    ],
  },
  {
    id: 'EQ-006',
    name: 'Конвейерная система Siemens',
    type: 'conveyor',
    status: 'active',
    location: 'Завод "Металлург", цех 1',
    qrCode: 'https://liftcare.kz/equipment/EQ-006',
    installationDate: '2019-09-15',
    lastMaintenance: '2024-10-05',
    nextMaintenance: '2025-01-05',
    repairHistory: [],
  },
]

const initialParts: Part[] = [
  {
    id: 'P-001',
    name: 'Трос стальной 12мм',
    stock: 10,
    unit: 'м',
    minStock: 5,
    price: 8500,
  },
  {
    id: 'P-002',
    name: 'Электродвигатель 5кВт',
    stock: 2,
    unit: 'шт',
    minStock: 1,
    price: 250000,
  },
  {
    id: 'P-003',
    name: 'Реле давления',
    stock: 15,
    unit: 'шт',
    minStock: 5,
    price: 12000,
  },
  {
    id: 'P-004',
    name: 'Датчик движения',
    stock: 20,
    unit: 'шт',
    minStock: 8,
    price: 8500,
  },
  {
    id: 'P-005',
    name: 'Кнопка вызова',
    stock: 25,
    unit: 'шт',
    minStock: 10,
    price: 3500,
  },
  {
    id: 'P-006',
    name: 'Предохранитель 10A',
    stock: 50,
    unit: 'шт',
    minStock: 20,
    price: 500,
  },
]

const initialOrders: Order[] = [
  {
    id: 'ORD-001',
    orderNumber: 'LC-2026-0001',
    title: 'Замена кнопок вызова',
    description: 'Не работают кнопки на 3 и 5 этажах',
    equipmentId: 'EQ-001',
    status: 'completed',
    priority: 'medium',
    createdBy: '1',
    createdAt: '2024-10-15T10:00:00',
    assignedTo: '3',
    assignedAt: '2024-10-15T10:30:00',
    startedAt: '2024-10-15T11:00:00',
    completedAt: '2024-10-15T14:30:00',
    diagnosis: 'Износ кнопочных механизмов',
    partsUsed: [{ partId: 'P-005', quantity: 2 }],
    notes: 'Работа выполнена качественно',
  },
  {
    id: 'ORD-002',
    orderNumber: 'LC-2026-0002',
    title: 'Плановое ТО эскалатора',
    description: 'Ежемесячное техническое обслуживание',
    equipmentId: 'EQ-002',
    status: 'completed',
    priority: 'low',
    createdBy: '2',
    createdAt: '2024-10-18T09:00:00',
    assignedTo: '3',
    assignedAt: '2024-10-18T09:15:00',
    startedAt: '2024-10-18T10:00:00',
    completedAt: '2024-10-18T13:00:00',
    diagnosis: 'Работает в штатном режиме',
    partsUsed: [],
    notes: 'Смазка и проверка безопасности',
  },
  {
    id: 'ORD-003',
    orderNumber: 'LC-2026-0003',
    title: 'Аварийная остановка лифта',
    description: 'Лифт остановился между этажами',
    equipmentId: 'EQ-005',
    status: 'completed',
    priority: 'critical',
    createdBy: '1',
    createdAt: '2024-10-20T16:30:00',
    assignedTo: '3',
    assignedAt: '2024-10-20T16:45:00',
    startedAt: '2024-10-20T17:00:00',
    completedAt: '2024-10-20T20:00:00',
    diagnosis: 'Проблема с датчиком двери',
    partsUsed: [{ partId: 'P-004', quantity: 1 }],
    notes: 'Датчик заменен, система проверена',
  },
]

// Storage keys
const STORAGE_KEYS = {
  USER: 'liftcare_user',
  USERS: 'liftcare_users',
  EQUIPMENT: 'liftcare_equipment',
  PARTS: 'liftcare_parts',
  ORDERS: 'liftcare_orders',
}

// Helper functions
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error)
    return defaultValue
  }
}

const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment)
  const [parts, setParts] = useState<Part[]>(initialParts)
  const [orders, setOrders] = useState<Order[]>(initialOrders)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = loadFromStorage<User | null>(STORAGE_KEYS.USER, null)
    setUser(savedUser)

    setUsers(loadFromStorage<User[]>(STORAGE_KEYS.USERS, initialUsers))
    setEquipment(loadFromStorage<Equipment[]>(STORAGE_KEYS.EQUIPMENT, initialEquipment))
    setParts(loadFromStorage<Part[]>(STORAGE_KEYS.PARTS, initialParts))
    setOrders(loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, initialOrders))
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (user) {
      saveToStorage(STORAGE_KEYS.USER, user)
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
  }, [user])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.USERS, users)
  }, [users])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.EQUIPMENT, equipment)
  }, [equipment])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PARTS, parts)
  }, [parts])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ORDERS, orders)
  }, [orders])

  // Actions
  const login = (email: string, password: string): boolean => {
    const foundUser = users.find((u) => u.email === email && u.password === password)
    if (foundUser) {
      setUser(foundUser)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      orderNumber: `LC-2026-${String(orders.length + 1).padStart(4, '0')}`,
      createdAt: new Date().toISOString(),
    }
    const updatedOrders = [...orders, newOrder]
    setOrders(updatedOrders)
    return newOrder
  }

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, additionalData?: Partial<Order>) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          const updatedOrder = {
            ...order,
            status: newStatus,
            ...additionalData,
          }

          // Auto-set timestamps based on status
          if (newStatus === 'assigned' && !updatedOrder.assignedAt) {
            updatedOrder.assignedAt = new Date().toISOString()
          }
          if (newStatus === 'in_progress' && !updatedOrder.startedAt) {
            updatedOrder.startedAt = new Date().toISOString()
          }
          if (newStatus === 'completed' && !updatedOrder.completedAt) {
            updatedOrder.completedAt = new Date().toISOString()
          }

          return updatedOrder
        }
        return order
      })
    )
  }

  const decrementPartStock = (partId: string, quantity: number) => {
    setParts((prevParts) =>
      prevParts.map((part) => {
        if (part.id === partId) {
          return {
            ...part,
            stock: Math.max(0, part.stock - quantity),
          }
        }
        return part
      })
    )
  }

  const value: AppContextType = {
    user,
    users,
    equipment,
    parts,
    orders,
    login,
    logout,
    createOrder,
    updateOrderStatus,
    decrementPartStock,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Custom hook
export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
