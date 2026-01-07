import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, TablePagination, TextField, InputAdornment, Button, Skeleton, IconButton, Stack, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Search, Add, Refresh, FilterList } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectQueryParams, selectPagination, setPage, setPageSize, setSearchFilter, setStatusFilter, clearFilters, selectFilters } from '../store/slices/ticketsSlice';
import { useGetTicketsQuery } from '../store/api/apiSlice';
import { STATUS_DISPLAY, PRIORITY_DISPLAY } from '../config/constants';
import { TicketStatus } from '../types';

const TicketsPage = () => {
  const dispatch = useAppDispatch();
  const queryParams = useAppSelector(selectQueryParams);
  const pagination = useAppSelector(selectPagination);
  const filters = useAppSelector(selectFilters);
  const { data, isLoading, isFetching, refetch } = useGetTicketsQuery(queryParams);

  const handlePageChange = (_: unknown, newPage: number) => {
    dispatch(setPage(newPage + 1));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPageSize(parseInt(event.target.value, 10)));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Tickets</Typography>
          <Typography variant="body2" color="text.secondary">
            {data?.total.toLocaleString() || 0} total tickets
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />}>New Ticket</Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              placeholder="Search tickets..."
              size="small"
              sx={{ width: 300 }}
              value={filters.search || ''}
              onChange={(e) => dispatch(setSearchFilter(e.target.value))}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                multiple
                value={filters.status || []}
                label="Status"
                onChange={(e) => dispatch(setStatusFilter(e.target.value as TicketStatus[]))}
                renderValue={(selected) => `${selected.length} selected`}
              >
                {Object.values(TicketStatus).map((status) => (
                  <MenuItem key={status} value={status}>{STATUS_DISPLAY[status].label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="text" onClick={() => dispatch(clearFilters())}>Clear</Button>
            <Box flex={1} />
            <IconButton onClick={() => refetch()}><Refresh /></IconButton>
          </Stack>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                Array(10).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    {Array(6).fill(0).map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}
                  </TableRow>
                ))
              ) : (
                data?.data.map((ticket) => (
                  <TableRow key={ticket.id} hover sx={{ cursor: 'pointer', opacity: isFetching ? 0.5 : 1 }}>
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 500 }}>{ticket.id}</TableCell>
                    <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.title}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={STATUS_DISPLAY[ticket.status].label}
                        sx={{ bgcolor: STATUS_DISPLAY[ticket.status].bgColor, color: STATUS_DISPLAY[ticket.status].color, fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={PRIORITY_DISPLAY[ticket.priority].label}
                        sx={{ bgcolor: `${PRIORITY_DISPLAY[ticket.priority].color}20`, color: PRIORITY_DISPLAY[ticket.priority].color, fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{ticket.category}</TableCell>
                    <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={data?.total || 0}
          page={pagination.page - 1}
          rowsPerPage={pagination.pageSize}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Card>
    </Box>
  );
};

export default TicketsPage;
