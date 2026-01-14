import React from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
  Avatar,
  Divider,
  Button
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import PeopleIcon from '@mui/icons-material/People'
import LogoutIcon from '@mui/icons-material/Logout'

const drawerWidth = 220


const AppShell = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }


  const pages = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/app/dashboard' },
    { label: 'Tickets', icon: <ConfirmationNumberIcon />, path: '/app/tickets' },
  ];

  // Adiciona Users só se for admin
  if (user?.role === 'admin') {
    pages.push({ label: 'Users', icon: <PeopleIcon />, path: '/app/users' });
  }


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Navbar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          {/* User Avatar and Name on the right */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 1 }}>{user?.login?.[0]?.toUpperCase() || 'U'}</Avatar>
            <Typography variant="subtitle1">{user?.login || 'Usuário'}</Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          {/* Sistema de Tickets title */}
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <Typography variant="h6" noWrap component="div">
              Sistema de Tickets
            </Typography>
          </Box>
          <Divider sx={{ mt: 2, mb: 2 }} />
          {/* Lista de páginas */}
          <List>
            {pages.map((page) => (
              <ListItem
                button
                key={page.label}
                component={Link}
                to={page.path}
                selected={location.pathname === page.path}
              >
                <ListItemIcon>{page.icon}</ListItemIcon>
                <ListItemText primary={page.label} />
              </ListItem>
            ))}
          </List>
          {/* Spacer para empurrar o conteúdo pra cima */}
          <Box sx={{ flexGrow: 1 }} />
          {/* Botão de Logout */}
          <Box sx={{ p: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Drawer>
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh'
        }}
      >
        <Toolbar /> {/* Espaço para não sobrepor o appbar */}
        <Outlet />
      </Box>
    </Box>
  )
}

export default AppShell