import { Chip, Stack, Typography } from '@mui/material'

export default function Orders() {
  const orders = [
    { id: 1001, status: 'DELIVERED', total: 538, items: 'Pizza x1, Noodles x2' },
    { id: 1002, status: 'PREPARING', total: 299, items: 'Burger x2' }
  ]
  return (
    <div className="space-y-3">
      <Typography variant="h6" fontWeight={700}>Your Orders</Typography>
      {orders.map(o => (
        <div key={o.id} className="border rounded-lg p-3 flex items-center justify-between">
          <div>
            <Typography fontWeight={600}>Order #{o.id}</Typography>
            <Typography variant="body2" color="text.secondary">{o.items}</Typography>
          </div>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip label={o.status} color={o.status === 'DELIVERED' ? 'success' : 'warning'} />
            <Typography fontWeight={700}>₹{o.total}</Typography>
          </Stack>
        </div>
      ))}
    </div>
  )
}