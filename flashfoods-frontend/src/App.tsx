import { AppBar, Box, Container, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import { Routes, Route, Navigate, Link as RouterLink } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RestaurantDetail from './pages/RestaurantDetail'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Favorites from './pages/Favorites'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Box>
      <AppBar position="sticky" color="inherit" elevation={0} className="border-b">
        <Toolbar className="gap-2">
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component={RouterLink} to="/" className="no-underline" color="inherit" sx={{ fontWeight: 700, flexGrow: 1 }}>
            FlashFoods
          </Typography>
          <IconButton component={RouterLink} to="/favorites" color="inherit"><FavoriteBorderIcon /></IconButton>
          <IconButton component={RouterLink} to="/orders" color="inherit"><ReceiptLongOutlinedIcon /></IconButton>
          <IconButton component={RouterLink} to="/cart" color="inherit"><ShoppingCartOutlinedIcon /></IconButton>
          <IconButton component={RouterLink} to="/admin" color="inherit"><DashboardOutlinedIcon /></IconButton>
          <IconButton component={RouterLink} to="/login" color="inherit"><LoginOutlinedIcon /></IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" className="min-h-screen py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App
