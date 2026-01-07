// ============================================
// RTK Query API Slice
// Centralized API configuration with mock data
// ============================================

import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import { API_CONFIG } from '../../config/constants';
import { AuthResponse, LoginCredentials, User, Ticket, PaginatedResponse, FilterParams, SortParams, PaginationParams, TicketFormData, TicketHistory, UserRole, TicketStatus, TicketPriority, TicketCategory, KPIData, ChartDataPoint, DashboardConfig, DashboardWidget } from '../../types';
import { logout, setCredentials } from '../slices/authSlice';

// Mock data generators
const generateMockUsers = (): User[] => {
  const departments = ['IT', 'HR', 'Finance', 'Operations', 'Engineering', 'Marketing'];
  const roles = [UserRole.ADMIN, UserRole.MANAGER, UserRole.REVIEWER, UserRole.VIEWER];
  
  return [
    {
      id: 'user-1',
      email: 'admin@enterprise.com',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      department: 'IT',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      isActive: true,
    },
    {
      id: 'user-2',
      email: 'manager@enterprise.com',
      firstName: 'Sarah',
      lastName: 'Manager',
      role: UserRole.MANAGER,
      department: 'IT',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      isActive: true,
    },
    {
      id: 'user-3',
      email: 'reviewer@enterprise.com',
      firstName: 'John',
      lastName: 'Reviewer',
      role: UserRole.REVIEWER,
      department: 'IT',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      isActive: true,
    },
    {
      id: 'user-4',
      email: 'viewer@enterprise.com',
      firstName: 'Jane',
      lastName: 'Viewer',
      role: UserRole.VIEWER,
      department: 'IT',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      isActive: true,
    },
    ...Array.from({ length: 50 }, (_, i) => ({
      id: `user-${i + 5}`,
      email: `user${i + 5}@enterprise.com`,
      firstName: `User`,
      lastName: `${i + 5}`,
      role: roles[i % roles.length],
      department: departments[i % departments.length],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      isActive: Math.random() > 0.1,
    })),
  ];
};

const generateMockTickets = (count: number = 10000): Ticket[] => {
  const statuses = Object.values(TicketStatus);
  const priorities = Object.values(TicketPriority);
  const categories = Object.values(TicketCategory);
  const users = generateMockUsers();
  
  const titles = [
    'Cannot access email', 'VPN connection issues', 'Printer not working',
    'Software installation request', 'Password reset needed', 'Network slow',
    'Laptop screen flickering', 'New equipment request', 'Access permission denied',
    'System crash', 'File recovery needed', 'Application error',
    'Security alert', 'Database connection timeout', 'Server unresponsive',
  ];

  return Array.from({ length: count }, (_, i) => {
    const createdDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    
    return {
      id: `TKT-${String(i + 1).padStart(6, '0')}`,
      title: `${titles[i % titles.length]} - Case ${i + 1}`,
      description: `Detailed description for ticket ${i + 1}. This is a ${priority} priority ${categories[i % categories.length]} issue that needs attention.`,
      status,
      priority,
      category: categories[i % categories.length],
      createdBy: users[Math.floor(Math.random() * users.length)].id,
      assignedTo: Math.random() > 0.3 ? users[Math.floor(Math.random() * 10)].id : null,
      createdAt: createdDate.toISOString(),
      updatedAt: new Date(createdDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      resolvedAt: status === TicketStatus.RESOLVED || status === TicketStatus.CLOSED ? new Date().toISOString() : null,
      closedAt: status === TicketStatus.CLOSED ? new Date().toISOString() : null,
      dueDate: new Date(createdDate.getTime() + 72 * 60 * 60 * 1000).toISOString(),
      slaBreached: Math.random() > 0.85,
      tags: ['support', categories[i % categories.length]],
    };
  });
};

// Cache mock data
let mockTickets: Ticket[] | null = null;
const getMockTickets = () => {
  if (!mockTickets) {
    mockTickets = generateMockTickets(10000);
  }
  return mockTickets;
};

// Base query with auth token
const baseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Base query with reauth logic
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  // Since we're using mock data, simulate API behavior
  const endpoint = typeof args === 'string' ? args : args.url;
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  
  return { data: null };
};

// Create the API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Ticket', 'User', 'Dashboard'],
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation<AuthResponse, LoginCredentials>({
      queryFn: async (credentials) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockUsers = generateMockUsers();
        const user = mockUsers.find(u => u.email === credentials.email);
        
        if (!user || credentials.password !== 'password123') {
          return {
            error: {
              status: 401,
              data: { message: 'Invalid credentials' },
            } as FetchBaseQueryError,
          };
        }
        
        return {
          data: {
            user,
            token: `mock-token-${Date.now()}`,
            refreshToken: `mock-refresh-${Date.now()}`,
            expiresIn: 3600,
          },
        };
      },
    }),
    
    logout: builder.mutation<void, void>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return { data: undefined };
      },
    }),
    
    // Ticket endpoints
    getTickets: builder.query<
      PaginatedResponse<Ticket>,
      { pagination: PaginationParams; sort?: SortParams; filters?: FilterParams }
    >({
      queryFn: async ({ pagination, sort, filters }) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        let tickets = [...getMockTickets()];
        
        // Apply filters
        if (filters) {
          if (filters.status?.length) {
            tickets = tickets.filter(t => filters.status!.includes(t.status));
          }
          if (filters.priority?.length) {
            tickets = tickets.filter(t => filters.priority!.includes(t.priority));
          }
          if (filters.category?.length) {
            tickets = tickets.filter(t => filters.category!.includes(t.category));
          }
          if (filters.search) {
            const search = filters.search.toLowerCase();
            tickets = tickets.filter(t => 
              t.title.toLowerCase().includes(search) ||
              t.id.toLowerCase().includes(search)
            );
          }
        }
        
        // Apply sorting
        if (sort) {
          tickets.sort((a, b) => {
            const aVal = a[sort.field as keyof Ticket];
            const bVal = b[sort.field as keyof Ticket];
            if (aVal === null) return 1;
            if (bVal === null) return -1;
            const comparison = String(aVal).localeCompare(String(bVal));
            return sort.direction === 'asc' ? comparison : -comparison;
          });
        }
        
        // Apply pagination
        const start = (pagination.page - 1) * pagination.pageSize;
        const paginatedTickets = tickets.slice(start, start + pagination.pageSize);
        
        return {
          data: {
            data: paginatedTickets,
            total: tickets.length,
            page: pagination.page,
            pageSize: pagination.pageSize,
            totalPages: Math.ceil(tickets.length / pagination.pageSize),
          },
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Ticket' as const, id })),
              { type: 'Ticket', id: 'LIST' },
            ]
          : [{ type: 'Ticket', id: 'LIST' }],
    }),
    
    getTicketById: builder.query<Ticket, string>({
      queryFn: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        const ticket = getMockTickets().find(t => t.id === id);
        if (!ticket) {
          return {
            error: { status: 404, data: { message: 'Ticket not found' } } as FetchBaseQueryError,
          };
        }
        return { data: ticket };
      },
      providesTags: (result, error, id) => [{ type: 'Ticket', id }],
    }),
    
    createTicket: builder.mutation<Ticket, TicketFormData>({
      queryFn: async (data) => {
        await new Promise(resolve => setTimeout(resolve, 400));
        const newTicket: Ticket = {
          id: `TKT-${String(getMockTickets().length + 1).padStart(6, '0')}`,
          ...data,
          status: TicketStatus.OPEN,
          createdBy: 'current-user',
          assignedTo: data.assignedTo || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          resolvedAt: null,
          closedAt: null,
          dueDate: data.dueDate || null,
          slaBreached: false,
          tags: data.tags || [],
        };
        mockTickets = [newTicket, ...getMockTickets()];
        return { data: newTicket };
      },
      invalidatesTags: [{ type: 'Ticket', id: 'LIST' }],
    }),
    
    updateTicket: builder.mutation<Ticket, { id: string; data: Partial<TicketFormData> }>({
      queryFn: async ({ id, data }) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const index = getMockTickets().findIndex(t => t.id === id);
        if (index === -1) {
          return {
            error: { status: 404, data: { message: 'Ticket not found' } } as FetchBaseQueryError,
          };
        }
        const updatedTicket = {
          ...getMockTickets()[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        mockTickets![index] = updatedTicket;
        return { data: updatedTicket };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Ticket', id }, { type: 'Ticket', id: 'LIST' }],
    }),
    
    updateTicketStatus: builder.mutation<Ticket, { id: string; status: TicketStatus; comment?: string }>({
      queryFn: async ({ id, status, comment }) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const index = getMockTickets().findIndex(t => t.id === id);
        if (index === -1) {
          return {
            error: { status: 404, data: { message: 'Ticket not found' } } as FetchBaseQueryError,
          };
        }
        const updatedTicket = {
          ...getMockTickets()[index],
          status,
          updatedAt: new Date().toISOString(),
          resolvedAt: status === TicketStatus.RESOLVED ? new Date().toISOString() : getMockTickets()[index].resolvedAt,
          closedAt: status === TicketStatus.CLOSED ? new Date().toISOString() : getMockTickets()[index].closedAt,
        };
        mockTickets![index] = updatedTicket;
        return { data: updatedTicket };
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Ticket', id }, { type: 'Ticket', id: 'LIST' }],
    }),
    
    getTicketHistory: builder.query<TicketHistory[], string>({
      queryFn: async (ticketId) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        const history: TicketHistory[] = [
          {
            id: '1',
            ticketId,
            action: 'Created',
            fromStatus: null,
            toStatus: TicketStatus.OPEN,
            performedBy: 'user-1',
            performedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            comment: 'Ticket created',
          },
          {
            id: '2',
            ticketId,
            action: 'Status Changed',
            fromStatus: TicketStatus.OPEN,
            toStatus: TicketStatus.IN_PROGRESS,
            performedBy: 'user-2',
            performedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            comment: 'Started working on this issue',
          },
        ];
        return { data: history };
      },
    }),
    
    // User endpoints
    getUsers: builder.query<PaginatedResponse<User>, PaginationParams>({
      queryFn: async (pagination) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const users = generateMockUsers();
        const start = (pagination.page - 1) * pagination.pageSize;
        const paginatedUsers = users.slice(start, start + pagination.pageSize);
        
        return {
          data: {
            data: paginatedUsers,
            total: users.length,
            page: pagination.page,
            pageSize: pagination.pageSize,
            totalPages: Math.ceil(users.length / pagination.pageSize),
          },
        };
      },
      providesTags: ['User'],
    }),
    
    // Dashboard endpoints
    getDashboardKPIs: builder.query<KPIData[], UserRole>({
      queryFn: async (role) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        const tickets = getMockTickets();
        
        const openCount = tickets.filter(t => t.status === TicketStatus.OPEN).length;
        const inProgressCount = tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length;
        const resolvedToday = tickets.filter(t => 
          t.resolvedAt && new Date(t.resolvedAt).toDateString() === new Date().toDateString()
        ).length;
        const slaBreached = tickets.filter(t => t.slaBreached).length;
        
        const kpis: KPIData[] = [
          { label: 'Open Tickets', value: openCount, change: 12, changeType: 'increase' },
          { label: 'In Progress', value: inProgressCount, change: -5, changeType: 'decrease' },
          { label: 'Resolved Today', value: resolvedToday, change: 8, changeType: 'increase' },
          { label: 'SLA Breached', value: slaBreached, change: 3, changeType: 'increase' },
        ];
        
        if (role === UserRole.ADMIN || role === UserRole.MANAGER) {
          kpis.push({ label: 'Total Tickets', value: tickets.length, change: 0, changeType: 'neutral' });
        }
        
        return { data: kpis };
      },
      providesTags: ['Dashboard'],
    }),
    
    getDashboardCharts: builder.query<{ ticketsByStatus: ChartDataPoint[]; ticketsByPriority: ChartDataPoint[]; ticketsTrend: ChartDataPoint[] }, UserRole>({
      queryFn: async () => {
        await new Promise(resolve => setTimeout(resolve, 250));
        const tickets = getMockTickets();
        
        const ticketsByStatus = Object.values(TicketStatus).map(status => ({
          label: status,
          value: tickets.filter(t => t.status === status).length,
        }));
        
        const ticketsByPriority = Object.values(TicketPriority).map(priority => ({
          label: priority,
          value: tickets.filter(t => t.priority === priority).length,
        }));
        
        // Generate trend data for last 7 days
        const ticketsTrend = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return {
            label: date.toLocaleDateString('en-US', { weekday: 'short' }),
            value: Math.floor(Math.random() * 100) + 50,
          };
        });
        
        return { data: { ticketsByStatus, ticketsByPriority, ticketsTrend } };
      },
      providesTags: ['Dashboard'],
    }),
    
    getDashboardConfig: builder.query<DashboardConfig, UserRole>({
      queryFn: async (role) => {
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Dynamic widget configuration based on role
        const baseWidgets: DashboardWidget[] = [
          { id: 'kpi-1', type: 'kpi', title: 'Key Metrics', dataSource: 'kpis', config: {}, position: { x: 0, y: 0, w: 12, h: 1 } },
          { id: 'chart-1', type: 'chart', title: 'Tickets by Status', dataSource: 'ticketsByStatus', config: { chartType: 'pie' }, position: { x: 0, y: 1, w: 6, h: 2 } },
          { id: 'chart-2', type: 'chart', title: 'Tickets by Priority', dataSource: 'ticketsByPriority', config: { chartType: 'bar' }, position: { x: 6, y: 1, w: 6, h: 2 } },
          { id: 'table-1', type: 'table', title: 'Recent Tickets', dataSource: 'recentTickets', config: {}, position: { x: 0, y: 3, w: 12, h: 2 } },
        ];
        
        if (role === UserRole.ADMIN || role === UserRole.MANAGER) {
          baseWidgets.push({
            id: 'chart-3',
            type: 'chart',
            title: 'Weekly Trend',
            dataSource: 'ticketsTrend',
            config: { chartType: 'line' },
            position: { x: 0, y: 5, w: 12, h: 2 },
          });
        }
        
        return { data: { role, widgets: baseWidgets } };
      },
    }),
  }),
});

// Export hooks for usage in components
export const {
  useLoginMutation,
  useLogoutMutation,
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useUpdateTicketStatusMutation,
  useGetTicketHistoryQuery,
  useGetUsersQuery,
  useGetDashboardKPIsQuery,
  useGetDashboardChartsQuery,
  useGetDashboardConfigQuery,
} = apiSlice;
