import {
  AlertTriangle,
  Banknote,
  Bell,
  Box,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  Eye,
  FileQuestion,
  FileText,
  Flag,
  Headphones,
  Home,
  ImagePlus,
  IndianRupee,
  Layers,
  Lock,
  Monitor,
  MoreHorizontal,
  Move,
  Package,
  Pencil,
  Plus,
  Printer,
  ReceiptText,
  RefreshCw,
  Search,
  Settings,
  Share2,
  ShoppingCart,
  SlidersHorizontal,
  Smartphone,
  Store,
  Trash2,
  Truck,
  Upload,
  UserCircle,
  Users,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'

export type AppIconName =
  | 'alert'
  | 'bell'
  | 'box'
  | 'calendar'
  | 'cart'
  | 'cash'
  | 'check'
  | 'check-circle'
  | 'chevron'
  | 'clock'
  | 'credit-card'
  | 'download'
  | 'eye'
  | 'file-question'
  | 'flag'
  | 'headphones'
  | 'home'
  | 'image'
  | 'invoice'
  | 'layers'
  | 'lock'
  | 'monitor'
  | 'more'
  | 'move'
  | 'package'
  | 'pencil'
  | 'plus'
  | 'printer'
  | 'receipt'
  | 'refresh'
  | 'rupee'
  | 'search'
  | 'settings'
  | 'share'
  | 'sliders'
  | 'smartphone'
  | 'store'
  | 'trash'
  | 'truck'
  | 'upload'
  | 'user'
  | 'users'
  | 'wrench'
  | 'x'
  | 'zap'

const icons: Record<AppIconName, LucideIcon> = {
  alert: AlertTriangle,
  bell: Bell,
  box: Box,
  calendar: CalendarDays,
  cart: ShoppingCart,
  cash: Banknote,
  check: Check,
  'check-circle': CheckCircle2,
  chevron: ChevronRight,
  clock: Clock,
  'credit-card': CreditCard,
  download: Download,
  eye: Eye,
  'file-question': FileQuestion,
  flag: Flag,
  headphones: Headphones,
  home: Home,
  image: ImagePlus,
  invoice: FileText,
  layers: Layers,
  lock: Lock,
  monitor: Monitor,
  more: MoreHorizontal,
  move: Move,
  package: Package,
  pencil: Pencil,
  plus: Plus,
  printer: Printer,
  receipt: ReceiptText,
  refresh: RefreshCw,
  rupee: IndianRupee,
  search: Search,
  settings: Settings,
  share: Share2,
  sliders: SlidersHorizontal,
  smartphone: Smartphone,
  store: Store,
  trash: Trash2,
  truck: Truck,
  upload: Upload,
  user: UserCircle,
  users: Users,
  wrench: Wrench,
  x: X,
  zap: Zap,
}

type AppIconProps = {
  name: AppIconName
  className?: string
  size?: number
}

export function AppIcon({ name, className, size }: AppIconProps) {
  const Icon = icons[name]
  return <Icon aria-hidden="true" className={className} size={size} />
}
