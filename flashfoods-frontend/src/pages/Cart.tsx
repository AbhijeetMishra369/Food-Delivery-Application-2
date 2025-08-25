import { Button, Divider, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import api from '../lib/api'

type CartItem = { id: number; menuItem: { name: string }; quantity: number; lineTotalCents: number }

type Cart = { items: CartItem[]; subtotalCents: number; discountCents: number; totalCents: number }

export default function Cart() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [coupon, setCoupon] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const load = () => api.get('/api/cart').then(res => setCart(res.data)).catch(() => setCart({ items: [], subtotalCents: 0, discountCents: 0, totalCents: 0 }))

  useEffect(() => { load() }, [])

  const applyCoupon = async () => {
    const code = coupon.trim()
    if (!code) {
      enqueueSnackbar('Please enter a coupon code', { variant: 'warning' })
      return
    }
    setIsApplying(true)
    try {
      const { data } = await api.post(`/api/cart/apply-coupon/${encodeURIComponent(code)}`)
      setCart(data)
      enqueueSnackbar('Coupon applied successfully ✔️', { variant: 'success' })
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Invalid coupon code'
      enqueueSnackbar(msg, { variant: 'error' })
    } finally {
      setIsApplying(false)
    }
  }

  const checkout = async () => {
    try {
      const { data } = await api.post('/api/orders/create')
      enqueueSnackbar(`Order created. Amount ₹${(data.amount/100).toFixed(0)}. Proceed to pay.`, { variant: 'info' })
      // Integrate Razorpay here using data.amount and data.orderId
    } catch (e) {
      enqueueSnackbar('Could not create order. Please try again.', { variant: 'error' })
    }
  }

  if (!cart) return <div />

  const subtotal = cart.subtotalCents/100
  const discount = cart.discountCents/100
  const total = cart.totalCents/100

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-3">
        <Typography variant="h6" fontWeight={700}>Your Cart</Typography>
        {cart.items.length === 0 && (
          <div className="border rounded-lg p-4 text-sm text-gray-600">Your cart is empty. Add some delicious items!</div>
        )}
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
        <Stack direction="row" spacing={1}>
          <TextField size="small" label="Coupon code" value={coupon} onChange={e => setCoupon(e.target.value)} fullWidth />
          <Button variant="outlined" size="small" onClick={applyCoupon} disabled={isApplying}>Apply</Button>
        </Stack>
        <Stack direction="row" justifyContent="space-between"><span>Subtotal</span><span>₹{subtotal}</span></Stack>
        <Stack direction="row" justifyContent="space-between"><span>Discount</span><span>-₹{discount}</span></Stack>
        <Divider />
        <Stack direction="row" justifyContent="space-between"><strong>Total</strong><strong>₹{total}</strong></Stack>
        <Button variant="contained" size="large" onClick={checkout} disabled={cart.items.length === 0}>Proceed to Pay</Button>
      </div>
    </div>
  )
}