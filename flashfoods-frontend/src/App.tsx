import { AppBar, Box, Container, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { Routes, Route, Navigate, Link as RouterLink } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <Box>
      <AppBar position="sticky" color="inherit" elevation={0} className="border-b">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component={RouterLink} to="/" className="no-underline" color="inherit" sx={{ fontWeight: 700 }}>
            FlashFoods
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" className="min-h-screen py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<div>Cart</div>} />
          <Route path="/orders" element={<div>Orders</div>} />
          <Route path="/favorites" element={<div>Favorites</div>} />
          <Route path="/admin" element={<div>Admin</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App
