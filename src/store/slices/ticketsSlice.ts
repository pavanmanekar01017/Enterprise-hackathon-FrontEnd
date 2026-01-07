// ============================================
// Tickets State Slice
// Local state for ticket-related UI
// ============================================

import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { FilterParams, SortParams, Ticket, TicketStatus, TicketPriority, TicketCategory } from '../../types';
import { PAGINATION_CONFIG } from '../../config/constants';

interface TicketsState {
  // Normalized entities
  selectedTicketId: string | null;
  
  // Table state
  pagination: {
    page: number;
    pageSize: number;
  };
  sort: SortParams;
  filters: FilterParams;
  
  // Selection state
  selectedIds: string[];
  
  // UI state
  isCreating: boolean;
  isEditing: boolean;
  filterPanelOpen: boolean;
}

const initialState: TicketsState = {
  selectedTicketId: null,
  pagination: {
    page: 1,
    pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
  },
  sort: {
    field: 'createdAt',
    direction: 'desc',
  },
  filters: {},
  selectedIds: [],
  isCreating: false,
  isEditing: false,
  filterPanelOpen: false,
};

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setSelectedTicket: (state, action: PayloadAction<string | null>) => {
      state.selectedTicketId = action.payload;
    },
    
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload;
      state.pagination.page = 1; // Reset to first page
    },
    
    setSort: (state, action: PayloadAction<SortParams>) => {
      state.sort = action.payload;
      state.pagination.page = 1; // Reset to first page
    },
    
    toggleSortDirection: (state) => {
      state.sort.direction = state.sort.direction === 'asc' ? 'desc' : 'asc';
    },
    
    setFilters: (state, action: PayloadAction<FilterParams>) => {
      state.filters = action.payload;
      state.pagination.page = 1; // Reset to first page
    },
    
    updateFilter: (state, action: PayloadAction<Partial<FilterParams>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.page = 1;
    },
    
    setStatusFilter: (state, action: PayloadAction<TicketStatus[]>) => {
      state.filters.status = action.payload;
      state.pagination.page = 1;
    },
    
    setPriorityFilter: (state, action: PayloadAction<TicketPriority[]>) => {
      state.filters.priority = action.payload;
      state.pagination.page = 1;
    },
    
    setCategoryFilter: (state, action: PayloadAction<TicketCategory[]>) => {
      state.filters.category = action.payload;
      state.pagination.page = 1;
    },
    
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.pagination.page = 1;
    },
    
    toggleTicketSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.selectedIds.indexOf(id);
      if (index === -1) {
        state.selectedIds.push(id);
      } else {
        state.selectedIds.splice(index, 1);
      }
    },
    
    selectAllTickets: (state, action: PayloadAction<string[]>) => {
      state.selectedIds = action.payload;
    },
    
    clearSelection: (state) => {
      state.selectedIds = [];
    },
    
    setIsCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },
    
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    
    toggleFilterPanel: (state) => {
      state.filterPanelOpen = !state.filterPanelOpen;
    },
    
    setFilterPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.filterPanelOpen = action.payload;
    },
    
    resetState: () => initialState,
  },
});

export const {
  setSelectedTicket,
  setPage,
  setPageSize,
  setSort,
  toggleSortDirection,
  setFilters,
  updateFilter,
  clearFilters,
  setStatusFilter,
  setPriorityFilter,
  setCategoryFilter,
  setSearchFilter,
  toggleTicketSelection,
  selectAllTickets,
  clearSelection,
  setIsCreating,
  setIsEditing,
  toggleFilterPanel,
  setFilterPanelOpen,
  resetState,
} = ticketsSlice.actions;

// Base selectors
export const selectTicketsState = (state: { tickets: TicketsState }) => state.tickets;
export const selectPagination = (state: { tickets: TicketsState }) => state.tickets.pagination;
export const selectSort = (state: { tickets: TicketsState }) => state.tickets.sort;
export const selectFilters = (state: { tickets: TicketsState }) => state.tickets.filters;
export const selectSelectedIds = (state: { tickets: TicketsState }) => state.tickets.selectedIds;
export const selectSelectedTicketId = (state: { tickets: TicketsState }) => state.tickets.selectedTicketId;
export const selectIsCreating = (state: { tickets: TicketsState }) => state.tickets.isCreating;
export const selectIsEditing = (state: { tickets: TicketsState }) => state.tickets.isEditing;
export const selectFilterPanelOpen = (state: { tickets: TicketsState }) => state.tickets.filterPanelOpen;

// Memoized selectors
export const selectActiveFiltersCount = createSelector(
  [selectFilters],
  (filters) => {
    let count = 0;
    if (filters.status?.length) count++;
    if (filters.priority?.length) count++;
    if (filters.category?.length) count++;
    if (filters.search) count++;
    if (filters.assignedTo) count++;
    if (filters.dateFrom || filters.dateTo) count++;
    return count;
  }
);

export const selectHasActiveFilters = createSelector(
  [selectActiveFiltersCount],
  (count) => count > 0
);

export const selectQueryParams = createSelector(
  [selectPagination, selectSort, selectFilters],
  (pagination, sort, filters) => ({
    pagination,
    sort,
    filters,
  })
);

export default ticketsSlice.reducer;
