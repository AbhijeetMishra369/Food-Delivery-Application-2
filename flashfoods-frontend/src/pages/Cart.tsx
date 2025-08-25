import { Button, Divider, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import api from '../lib/api'

type CartItem = { id: number; menuItem: { name: string }; quantity: number; lineTotalCents: number }

type Cart = { items: CartItem[]; subtotalCents: number; discountCents: number; totalCents: number }

export default function Cart() {
  const [cart, setCart] = useState<Cart | null>(null)

  const load = () => api.get('/api/cart').then(res => setCart(res.data))

  useEffect(() => { load() }, [])

  const checkout = async () => {
    const { data } = await api.post('/api/orders/create')
    // Razorpay checkout placeholder; integrate with real SDK using data.amount and data.orderId when backend provides
    alert(`Order created: ${data.orderId}, amount: ₹${(data.amount/100).toFixed(0)}`)
  }

  if (!cart) return <div />

  const subtotal = cart.subtotalCents/100
  const discount = cart.discountCents/100
  const total = cart.totalCents/100

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-3">
        <Typography variant="h6" fontWeight={700}>Your Cart</Typography>
        {cart.items.map(i => (
          <div key={i.id} className="flex items-center justify-between border rounded-lg p-3">
            <div>
              <Typography fontWeight={600}>{i.menuItem.name}</Typography>
              <Typography variant="body2" color="text.secondary">Qty: {i.quantity}</Typography>
            </div>
            <Typography fontWeight={700}>₹{(i.lineTotalCents/100).toFixed(0)}</Typography>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <Typography variant="h6" fontWeight={700}>Bill Details</Typography>
        <Stack direction="row" justifyContent="space-between"><span>Subtotal</span><span>₹{subtotal}</span></Stack>
        <Stack direction="row" justifyContent="space-between"><span>Discount</span><span>-₹{discount}</span></Stack>
        <Divider />
        <Stack direction="row" justifyContent="space-between"><strong>Total</strong><strong>₹{total}</strong></Stack>
        <Button variant="contained" size="large" onClick={checkout}>Proceed to Pay</Button>
      </div>
    </div>
  )
}