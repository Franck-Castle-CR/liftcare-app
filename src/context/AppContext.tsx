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
  adjustPartStock: (partId: string, change: number) => void
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

initialUsers[0] = { ...initialUsers[0], name: 'Алия Садыкова' }
initialUsers[1] = { ...initialUsers[1], name: 'Данияр Сапаров' }
initialUsers[2] = { ...initialUsers[2], name: 'Арман Бекенов' }
initialUsers[3] = { ...initialUsers[3], name: 'Алия Жумабекова' }
initialUsers.push(
  { id: '5', email: 'engineer2@liftcare.kz', password: 'demo123', name: 'Нурлан Тлеубаев', role: 'engineer', phone: '+7 777 555 1005' },
  { id: '6', email: 'engineer3@liftcare.kz', password: 'demo123', name: 'Айбек Оразов', role: 'engineer', phone: '+7 777 555 1006' },
  { id: '7', email: 'engineer4@liftcare.kz', password: 'demo123', name: 'Марат Касымов', role: 'engineer', phone: '+7 777 555 1007' },
  { id: '8', email: 'engineer5@liftcare.kz', password: 'demo123', name: 'Ерлан Нуртаев', role: 'engineer', phone: '+7 777 555 1008' },
  { id: '9', email: 'client2@liftcare.kz', password: 'demo123', name: 'ТОО «Астана Сервис»', role: 'client' },
  { id: '10', email: 'client3@liftcare.kz', password: 'demo123', name: 'БЦ «Орбита»', role: 'client' },
  { id: '11', email: 'client4@liftcare.kz', password: 'demo123', name: 'Завод «Металлург»', role: 'client' },
  { id: '12', email: 'client5@liftcare.kz', password: 'demo123', name: 'Логистик Центр', role: 'client' },
  { id: '13', email: 'engineer6@liftcare.kz', password: 'demo123', name: 'Тимур Абдрахманов', role: 'engineer', phone: '+7 777 555 1013' },
  { id: '14', email: 'engineer7@liftcare.kz', password: 'demo123', name: 'Руслан Ибраев', role: 'engineer', phone: '+7 777 555 1014' },
  { id: '15', email: 'engineer8@liftcare.kz', password: 'demo123', name: 'Серик Жанатов', role: 'engineer', phone: '+7 777 555 1015' },
)

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

initialEquipment.forEach((item, index) => {
  item.lastMaintenance = '2026-08-15'
  item.nextMaintenance = index % 2 === 0 ? '2026-11-15' : '2026-12-15'
})

for (let index = initialEquipment.length + 1; index <= 25; index += 1) {
  const types = ['Лифт пассажирский', 'Эскалатор', 'Башенный кран', 'Промышленный чиллер', 'Конвейерная линия']
  const sites = ['БЦ «Орбита»', 'ТЦ «Астана»', 'Завод «Металлург»', 'Логистик Центр', 'Клиника «Сункар»', 'ЖК «Солнечный»', 'Стройплощадка «Мегаполис»']
  const equipmentType = types[(index - 1) % types.length]
  initialEquipment.push({
    id: `EQ-${String(index).padStart(3, '0')}`,
    name: `${equipmentType} ${['Otis', 'KONE', 'Schindler', 'Siemens', 'Daikin'][(index - 1) % 5]}-${100 + index}`,
    type: equipmentType.toLowerCase(),
    status: index % 9 === 0 ? 'broken' : index % 6 === 0 ? 'maintenance' : 'active',
    location: sites[(index - 1) % sites.length],
    qrCode: `https://liftcare.kz/equipment/EQ-${String(index).padStart(3, '0')}`,
    installationDate: `202${index % 5}-0${(index % 8) + 1}-15`,
    lastMaintenance: '2026-09-15',
    nextMaintenance: '2026-11-15',
    repairHistory: [],
  })
}

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

for (let index = initialParts.length + 1; index <= 20; index += 1) {
  const partNames = ['Ролик двери кабины', 'Контактор силовой 24V', 'Концевой выключатель', 'Подшипник тягового шкива', 'Плата управления лифтом', 'Реле контроля фаз', 'Тормозная колодка', 'Кнопка вызова', 'Датчик перегрузки', 'Плавкий предохранитель', 'Трос стальной 10 мм', 'Масло редуктора', 'Цепь эскалатора', 'Датчик уровня пола']
  const name = partNames[index - initialParts.length - 1]
  const unit = ['Трос стальной 10 мм'].includes(name) ? 'м' : name === 'Масло редуктора' ? 'л' : 'шт'
  initialParts.push({
    id: `P-${String(index).padStart(3, '0')}`,
    name,
    manufacturer: ['Otis', 'KONE', 'Schindler', 'Siemens', 'Daikin'][index % 5],
    warehouse: 'Основной склад · Астана',
    compatibleEquipment: ['elevator', 'escalator'],
    stock: index % 4 === 0 ? 3 : 8 + index,
    unit,
    minStock: 5,
    price: 4500 + index * 1750,
  })
}

initialParts.forEach((part, index) => {
  part.manufacturer ??= ['Otis', 'KONE', 'Schindler', 'Siemens', 'Daikin'][index % 5]
  part.warehouse ??= 'Основной склад · Астана'
  part.compatibleEquipment ??= ['elevator']
})

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

initialOrders[0] = {
  ...initialOrders[0],
  title: 'Пассажирский лифт не открывает двери',
  description: 'Двери кабины не открываются на первом этаже. Нужна срочная диагностика.',
  status: 'new',
  priority: 'critical',
  createdAt: '2026-10-27T08:30:00.000Z',
  assignedTo: undefined,
  assignedAt: undefined,
  completedAt: undefined,
  diagnosis: undefined,
  partsUsed: undefined,
  photos: [],
}
initialOrders[1] = { ...initialOrders[1], title: 'Посторонний шум при движении', description: 'Во время движения лифта слышен посторонний шум в шахте. Нужен осмотр тягового узла.', status: 'assigned', priority: 'high', createdAt: '2026-10-27T10:00:00.000Z', assignedTo: '3', assignedAt: new Date().toISOString(), startedAt: undefined, completedAt: undefined, diagnosis: undefined, partsUsed: [], photos: [] }
initialOrders[2] = { ...initialOrders[2], title: 'Плановая замена троса', description: 'Плановая замена изношенного тягового троса пассажирского лифта.', status: 'new', priority: 'medium', createdAt: '2026-10-28T06:30:00.000Z', assignedTo: undefined, assignedAt: undefined, startedAt: undefined, completedAt: undefined, diagnosis: undefined, partsUsed: [], photos: [] }
initialOrders.push(
  {
    id: 'ORD-004', orderNumber: 'LC-2026-0004', title: 'Башенный кран не реагирует на пульт', description: 'Не работает дистанционное управление краном.', equipmentId: 'EQ-003', status: 'new', priority: 'critical', createdBy: '1', createdAt: '2026-10-28T07:15:00.000Z', photos: [],
  },
  {
    id: 'ORD-005', orderNumber: 'LC-2026-0005', title: 'Проверка датчика безопасности', description: 'Плановая проверка концевого выключателя.', equipmentId: 'EQ-004', status: 'assigned', priority: 'high', createdBy: '1', createdAt: '2026-10-28T07:45:00.000Z', assignedTo: '3', assignedAt: new Date().toISOString(), photos: [],
  },
)
for (let index = initialOrders.length + 1; index <= 30; index += 1) {
  const equipmentNumber = ((index - 1) % initialEquipment.length) + 1
  const clientId = ['1', '9', '10', '11', '12'][(index - 1) % 5]
  const engineerIds = ['3', '5', '6', '7', '8', '13', '14', '15']
  const engineerId = engineerIds[(index - 1) % engineerIds.length]
  const isCompleted = index % 3 === 0
  initialOrders.push({
    id: `ORD-${String(index).padStart(3, '0')}`,
    orderNumber: `LC-2026-${String(index).padStart(4, '0')}`,
    title: ['Проверка системы безопасности', 'Плановое техническое обслуживание', 'Устранение вибрации оборудования', 'Замена изношенного датчика'][index % 4],
    description: 'Демонстрационная заявка для проверки работы системы LiftCare.',
    equipmentId: `EQ-${String(equipmentNumber).padStart(3, '0')}`,
    status: isCompleted ? 'completed' : index % 2 === 0 ? 'assigned' : 'new',
    priority: (['low', 'medium', 'high', 'critical'] as const)[index % 4],
    createdBy: clientId,
    createdAt: `2026-10-${String(1 + (index % 27)).padStart(2, '0')}T09:00:00.000Z`,
    ...(isCompleted ? { assignedTo: engineerId, deadline: '2026-10-11T12:30:00.000Z', assignedAt: '2026-10-10T10:00:00.000Z', startedAt: '2026-10-10T11:00:00.000Z', completedAt: '2026-10-10T12:30:00.000Z', diagnosis: 'Проведена проверка узлов, выявлен естественный износ.', partsUsed: [], photos: [] } : index % 2 === 0 ? { assignedTo: engineerId, deadline: '2026-10-30T15:00:00.000Z', assignedAt: '2026-10-25T10:00:00.000Z' } : { photos: [] }),
  })
}

// Storage keys
const STORAGE_KEYS = {
  USER: 'liftcare_user_v3',
  USERS: 'liftcare_users_v3',
  EQUIPMENT: 'liftcare_equipment_v3',
  PARTS: 'liftcare_parts_v3',
  ORDERS: 'liftcare_orders_v3',
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
  const [user, setUser] = useState<User | null>(() => loadFromStorage<User | null>(STORAGE_KEYS.USER, null))
  const [users] = useState<User[]>(() => loadFromStorage<User[]>(STORAGE_KEYS.USERS, initialUsers))
  const [equipment] = useState<Equipment[]>(() => loadFromStorage<Equipment[]>(STORAGE_KEYS.EQUIPMENT, initialEquipment))
  const [parts, setParts] = useState<Part[]>(() => loadFromStorage<Part[]>(STORAGE_KEYS.PARTS, initialParts))
  const [orders, setOrders] = useState<Order[]>(() => loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, initialOrders))

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
    const highestNumber = orders.reduce((highest, order) => {
      const parsed = Number(order.orderNumber.split('-').at(-1))
      return Number.isFinite(parsed) ? Math.max(highest, parsed) : highest
    }, 0)
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      orderNumber: `LC-${new Date().getFullYear()}-${String(highestNumber + 1).padStart(4, '0')}`,
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
          if (quantity <= 0 || part.stock < quantity) return part
          return {
            ...part,
            stock: part.stock - quantity,
          }
        }
        return part
      })
    )
  }

  const adjustPartStock = (partId: string, change: number) => {
    setParts((prevParts) => prevParts.map((part) => part.id === partId && part.stock + change >= 0
      ? { ...part, stock: part.stock + change }
      : part))
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
    adjustPartStock,
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
