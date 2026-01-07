// ============================================
// Enterprise IT Service Desk - Type Definitions
// ============================================

// User Roles - Strict enum for type safety
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  REVIEWER = 'reviewer',
  VIEWER = 'viewer',
}

// Role hierarchy for permission checks
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.ADMIN]: 4,
  [UserRole.MANAGER]: 3,
  [UserRole.REVIEWER]: 2,
  [UserRole.VIEWER]: 1,
};

// User entity
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// Auth types
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  tokenExpiresAt: number | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// Ticket/Request types
export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  PENDING_REVIEW = 'pending_review',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  REJECTED = 'rejected',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum TicketCategory {
  HARDWARE = 'hardware',
  SOFTWARE = 'software',
  NETWORK = 'network',
  ACCESS = 'access',
  OTHER = 'other',
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdBy: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  closedAt: string | null;
  dueDate: string | null;
  slaBreached: boolean;
  tags: string[];
}

export interface TicketHistory {
  id: string;
  ticketId: string;
  action: string;
  fromStatus: TicketStatus | null;
  toStatus: TicketStatus | null;
  performedBy: string;
  performedAt: string;
  comment: string | null;
}

// Workflow transition rules
export interface WorkflowTransition {
  from: TicketStatus;
  to: TicketStatus;
  allowedRoles: UserRole[];
  requiresComment: boolean;
}

// API pagination types
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterParams {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  category?: TicketCategory[];
  assignedTo?: string;
  createdBy?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Dashboard types
export interface KPIData {
  label: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon?: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  category?: string;
}

export interface DashboardWidget {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'list';
  title: string;
  dataSource: string;
  config: Record<string, unknown>;
  position: { x: number; y: number; w: number; h: number };
}

export interface DashboardConfig {
  role: UserRole;
  widgets: DashboardWidget[];
}

// Form types
export interface TicketFormData {
  title: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
  assignedTo?: string;
  dueDate?: string;
  tags?: string[];
}

// Error types
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}

// UI State types
export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  createdAt: string;
  read: boolean;
}
