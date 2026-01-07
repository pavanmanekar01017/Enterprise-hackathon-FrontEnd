import { Box, Typography, Card, CardContent, Chip, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid';
import { TrendingUp, TrendingDown, Remove } from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

import { useAppSelector } from '../store/hooks';
import { selectCurrentUser } from '../store/slices/authSlice';
import {
  useGetDashboardKPIsQuery,
  useGetDashboardChartsQuery,
} from '../store/api/apiSlice';
import { STATUS_DISPLAY, PRIORITY_DISPLAY } from '../config/constants';

const CHART_COLORS = [
  '#1565C0',
  '#F57C00',
  '#7B1FA2',
  '#388E3C',
  '#455A64',
  '#C62828',
];

const DashboardPage = () => {
  const user = useAppSelector(selectCurrentUser);

  const { data: kpis, isLoading: kpisLoading } =
    useGetDashboardKPIsQuery(user?.role);

  const { data: charts, isLoading: chartsLoading } =
    useGetDashboardChartsQuery(user?.role);

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back, {user?.firstName}. Here's your overview.
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpisLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card>
                  <CardContent>
                    <Skeleton variant="rectangular" height={80} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : kpis?.map((kpi, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {kpi.label}
                    </Typography>

                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="h3" fontWeight={700}>
                        {kpi.value.toLocaleString()}
                      </Typography>

                      <Chip
                        size="small"
                        icon={
                          kpi.changeType === 'increase' ? (
                            <TrendingUp fontSize="small" />
                          ) : kpi.changeType === 'decrease' ? (
                            <TrendingDown fontSize="small" />
                          ) : (
                            <Remove fontSize="small" />
                          )
                        }
                        label={`${kpi.change > 0 ? '+' : ''}${kpi.change}%`}
                        sx={{
                          bgcolor:
                            kpi.changeType === 'increase'
                              ? '#E8F5E9'
                              : kpi.changeType === 'decrease'
                              ? '#FFEBEE'
                              : '#F5F5F5',
                          color:
                            kpi.changeType === 'increase'
                              ? '#2E7D32'
                              : kpi.changeType === 'decrease'
                              ? '#C62828'
                              : '#757575',
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Tickets by Status */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 350, overflow: 'hidden' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Tickets by Status
              </Typography>

              {chartsLoading ? (
                <Skeleton variant="rectangular" height={250} />
              ) : (
                <Box sx={{ width: '120%', ml: '-10%' }}>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={charts?.ticketsByStatus.map((d) => ({
                          ...d,
                          name:
                            STATUS_DISPLAY[
                              d.label as keyof typeof STATUS_DISPLAY
                            ]?.label || d.label,
                        }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {charts?.ticketsByStatus.map((_, index) => (
                          <Cell
                            key={index}
                            fill={
                              CHART_COLORS[index % CHART_COLORS.length]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Tickets by Priority */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 350, overflow: 'hidden' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Tickets by Priority
              </Typography>

              {chartsLoading ? (
                <Skeleton variant="rectangular" height={250} />
              ) : (
                <Box sx={{ width: '120%', ml: '-10%' }}>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={charts?.ticketsByPriority.map((d) => ({
                        ...d,
                        name:
                          PRIORITY_DISPLAY[
                            d.label as keyof typeof PRIORITY_DISPLAY
                          ]?.label || d.label,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#1565C0"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Trend */}
        <Grid item xs={12}>
          <Card sx={{ height: 350, overflow: 'hidden' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Weekly Trend
              </Typography>

              {chartsLoading ? (
                <Skeleton variant="rectangular" height={250} />
              ) : (
                <Box sx={{ width: '120%', ml: '-10%' }}>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={charts?.ticketsTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#1565C0"
                        strokeWidth={2}
                        dot={{ fill: '#1565C0' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
