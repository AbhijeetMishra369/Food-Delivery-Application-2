import { Container } from '@mui/material'
import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <Container maxWidth="lg" className="min-h-screen py-6">
      <Routes>
        <Route path="/" element={<div className="text-2xl font-semibold">FlashFoods</div>} />
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/register" element={<div>Register</div>} />
        <Route path="/restaurants" element={<div>Restaurants</div>} />
        <Route path="/cart" element={<div>Cart</div>} />
        <Route path="/orders" element={<div>Orders</div>} />
        <Route path="/admin" element={<div>Admin Panel</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Container>
  )
}

export default App
