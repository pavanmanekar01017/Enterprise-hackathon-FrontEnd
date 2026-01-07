import { useLocation, useNavigate } from 'react-router-dom';
import { Drawer, Box, Typography, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard, ConfirmationNumber, People, Assessment, Settings, Groups, Queue } from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { NAV_ITEMS } from '../../config/constants';
import { UserRole } from '../../types';

const ICON_MAP: Record<string, React.ReactNode> = {
  dashboard: <Dashboard />,
  confirmation_number: <ConfirmationNumber />,
  people: <People />,
  assessment: <Assessment />,
  settings: <Settings />,
  groups: <Groups />,
  queue: <Queue />,
};

interface SidebarProps {
  open: boolean;
  width: number;
}

const Sidebar = ({ open, width }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);

  const roleNavItems = user?.role ? NAV_ITEMS[user.role as UserRole] || [] : [];
  const allNavItems = [...NAV_ITEMS.common, ...roleNavItems];

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
        },
      }}
    >
      <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={700} color="primary.main">IT Service Desk</Typography>
        <Typography variant="caption" color="text.secondary">Enterprise Platform</Typography>
      </Box>

      <List sx={{ px: 1, py: 2 }}>
        {allNavItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <ListItemButton
              key={item.path}
              selected={isActive}
              onClick={() => navigate(item.path)}
              sx={{ mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'primary.main' : 'text.secondary' }}>
                {ICON_MAP[item.icon] || <Dashboard />}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'primary.main' : 'text.primary',
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
