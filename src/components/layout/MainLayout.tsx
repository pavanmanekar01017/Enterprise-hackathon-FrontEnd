import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Divider, Badge, useTheme } from '@mui/material';
import { Menu as MenuIcon, Notifications, Logout, Person, Settings } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectCurrentUser, logout } from '../../store/slices/authSlice';
import { toggleSidebar, selectSidebarOpen } from '../../store/slices/uiSlice';
import Sidebar from './Sidebar';
import { ROLE_DISPLAY } from '../../config/constants';

const DRAWER_WIDTH = 260;

const MainLayout = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: sidebarOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
          ml: sidebarOpen ? `${DRAWER_WIDTH}px` : 0,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton edge="start" onClick={() => dispatch(toggleSidebar())} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Box flex={1} />
          <IconButton>
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 1 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14 }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} sx={{ mt: 1 }}>
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography fontWeight={600}>{user?.firstName} {user?.lastName}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
              <Typography variant="caption" display="block" sx={{ color: ROLE_DISPLAY[user?.role]?.color, fontWeight: 500 }}>
                {ROLE_DISPLAY[user?.role]?.label}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => setAnchorEl(null)}><Person fontSize="small" sx={{ mr: 1.5 }} /> Profile</MenuItem>
            <MenuItem onClick={() => setAnchorEl(null)}><Settings fontSize="small" sx={{ mr: 1.5 }} /> Settings</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}><Logout fontSize="small" sx={{ mr: 1.5 }} /> Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} width={DRAWER_WIDTH} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          bgcolor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
          ml: sidebarOpen ? 0 : `-${DRAWER_WIDTH}px`,
          width: sidebarOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
