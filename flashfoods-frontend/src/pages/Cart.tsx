import { Button, Divider, Stack, Typography } from '@mui/material'

export default function Cart() {
  const items = [
    { id: 1, name: 'Margherita Pizza', qty: 1, price: 199 },
    { id: 2, name: 'Veg Hakka Noodles', qty: 2, price: 179 }
  ]
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)
  const discount = 40
  const total = subtotal - discount

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-3">
        <Typography variant="h6" fontWeight={700}>Your Cart</Typography>
        {items.map(i => (
          <div key={i.id} className="flex items-center justify-between border rounded-lg p-3">
            <div>
              <Typography fontWeight={600}>{i.name}</Typography>
              <Typography variant="body2" color="text.secondary">Qty: {i.qty}</Typography>
            </div>
            <Typography fontWeight={700}>₹{i.qty * i.price}</Typography>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <Typography variant="h6" fontWeight={700}>Bill Details</Typography>
        <Stack direction="row" justifyContent="space-between"><span>Subtotal</span><span>₹{subtotal}</span></Stack>
        <Stack direction="row" justifyContent="space-between"><span>Discount</span><span>-₹{discount}</span></Stack>
        <Divider />
        <Stack direction="row" justifyContent="space-between"><strong>Total</strong><strong>₹{total}</strong></Stack>
        <Button variant="contained" size="large">Proceed to Pay</Button>
      </div>
    </div>
  )
}