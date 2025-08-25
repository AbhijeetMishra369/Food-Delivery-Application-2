import { Chip, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import api from '../lib/api'

type Order = { id: number; status: string; totalCents: number; items: Array<{ menuItem: { name: string }; quantity: number }> }

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  useEffect(() => { api.get('/api/orders').then(res => setOrders(res.data)) }, [])
  return (
    <div className="space-y-3">
      <Typography variant="h6" fontWeight={700}>Your Orders</Typography>
      {orders.map(o => (
        <div key={o.id} className="border rounded-lg p-3 flex items-center justify-between">
          <div>
            <Typography fontWeight={600}>Order #{o.id}</Typography>
            <Typography variant="body2" color="text.secondary">{o.items.map(i => `${i.menuItem.name} x${i.quantity}`).join(', ')}</Typography>
          </div>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip label={o.status} color={o.status === 'DELIVERED' ? 'success' : 'warning'} />
            <Typography fontWeight={700}>₹{(o.totalCents/100).toFixed(0)}</Typography>
          </Stack>
        </div>
      ))}
    </div>
  )
}