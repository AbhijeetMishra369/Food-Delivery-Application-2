import { Button, Divider, IconButton, Stack, TextField, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useEffect, useState } from 'react'
import api from '../lib/api'
import { useSnackbar } from 'notistack'

type Restaurant = { id: number; name: string; description?: string }
type MenuItem = { id: number; name: string; description?: string; priceCents: number; imageUrl?: string }
type Order = { id: number; status: string; totalCents: number }

export default function AdminDashboard() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [newItem, setNewItem] = useState({ name: '', price: '', imageUrl: '', description: '' })
  const { enqueueSnackbar } = useSnackbar()

  const load = async () => {
    try {
      const { data: restaurants } = await api.get('/api/restaurants')
      const mine = restaurants[0] as Restaurant | undefined
      if (mine) {
        setRestaurant(mine)
        const { data: items } = await api.get(`/api/menu/restaurant/${mine.id}`)
        setMenu(items)
        const { data: ords } = await api.get(`/api/orders/restaurant/${mine.id}`)
        setOrders(ords)
      }
    } catch {}
  }

  useEffect(() => { load() }, [])

  const createMenuItem = async () => {
    if (!restaurant) return
    const priceCents = Math.max(1, Math.round(Number(newItem.price) * 100))
    try {
      const { data } = await api.post(`/api/menu/restaurant/${restaurant.id}`, {
        name: newItem.name.trim() || 'New Dish',
        description: newItem.description.trim() || 'Tasty and fresh',
        imageUrl: newItem.imageUrl.trim() || 'https://images.unsplash.com/photo-1604908176997-431632bed5d8?q=80&w=1200&auto=format&fit=crop',
        priceCents,
        available: true
      })
      setMenu([data, ...menu])
      setNewItem({ name: '', price: '', imageUrl: '', description: '' })
      enqueueSnackbar('Menu item added', { variant: 'success' })
    } catch { enqueueSnackbar('Failed to add item', { variant: 'error' }) }
  }

  const deleteMenuItem = async (id: number) => {
    try {
      await api.delete(`/api/menu/${id}`)
      setMenu(menu.filter(m => m.id !== id))
    } catch {}
  }

  const updateOrderStatus = async (id: number, status: string) => {
    try {
      const { data } = await api.post(`/api/orders/${id}/status?status=${encodeURIComponent(status)}`)
      setOrders(orders.map(o => o.id === id ? { ...o, status: data.status } : o))
    } catch {}
  }

  return (
    <div className="space-y-4">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight={700}>Owner Admin</Typography>
        <IconButton size="small" onClick={load}><RefreshIcon /></IconButton>
      </Stack>

      <div className="border rounded-lg p-3 space-y-3">
        <Typography fontWeight={700}>Add Menu Item</Typography>
        <Stack direction="row" spacing={1}>
          <TextField size="small" label="Name" value={newItem.name} onChange={e => setNewItem(v => ({ ...v, name: e.target.value }))} fullWidth />
          <TextField size="small" label="Price (₹)" type="number" value={newItem.price} onChange={e => setNewItem(v => ({ ...v, price: e.target.value }))} />
        </Stack>
        <Stack direction="row" spacing={1}>
          <TextField size="small" label="Image URL" value={newItem.imageUrl} onChange={e => setNewItem(v => ({ ...v, imageUrl: e.target.value }))} fullWidth />
          <TextField size="small" label="Description" value={newItem.description} onChange={e => setNewItem(v => ({ ...v, description: e.target.value }))} fullWidth />
        </Stack>
        <Button variant="contained" onClick={createMenuItem} disabled={!restaurant}>Add</Button>
      </div>

      <div className="border rounded-lg p-3 space-y-2">
        <Typography fontWeight={700}>Menu</Typography>
        <Divider />
        {menu.map(m => (
          <div key={m.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={m.imageUrl} className="w-12 h-12 object-cover rounded" />
              <div>
                <div className="font-semibold">{m.name}</div>
                <div className="text-sm text-gray-500">₹{(m.priceCents/100).toFixed(0)}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
              <IconButton size="small" onClick={() => deleteMenuItem(m.id)}><DeleteIcon fontSize="small" /></IconButton>
            </div>
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-3 space-y-2">
        <Typography fontWeight={700}>Orders</Typography>
        <Divider />
        {orders.map(o => (
          <div key={o.id} className="flex items-center justify-between">
            <div className="font-semibold">Order #{o.id}</div>
            <div className="flex items-center gap-2">
              <TextField size="small" select SelectProps={{ native: true }} value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)}>
                {['CREATED','PAID','PREPARING','DISPATCHED','DELIVERED','CANCELLED'].map(s => <option key={s} value={s}>{s}</option>)}
              </TextField>
              <div className="text-sm text-gray-600">₹{(o.totalCents/100).toFixed(0)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}