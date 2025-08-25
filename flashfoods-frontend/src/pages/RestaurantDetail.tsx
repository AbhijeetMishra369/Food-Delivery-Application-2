import { Button, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/api'

type Restaurant = { id: number; name: string; description?: string; logoUrl?: string }
type MenuItem = { id: number; name: string; description?: string; priceCents: number; imageUrl?: string }

export default function RestaurantDetail() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menu, setMenu] = useState<MenuItem[]>([])

  useEffect(() => {
    if (!id) return
    api.get(`/api/restaurants/${id}`).then(res => setRestaurant(res.data))
    api.get(`/api/menu/restaurant/${id}`).then(res => setMenu(res.data))
  }, [id])

  const addToCart = (menuItemId: number) => {
    api.post(`/api/cart/add/${menuItemId}?qty=1`).catch(() => {})
  }

  return (
    <div className="space-y-6">
      <div className="h-56 md:h-72 w-full rounded-xl overflow-hidden relative">
        <img src={restaurant?.logoUrl || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1600&auto=format&fit=crop'} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-5 text-white">
          <Typography variant="h5" fontWeight={700}>{restaurant?.name || 'Restaurant'}</Typography>
          <Typography variant="body2" className="opacity-90">{restaurant?.description || 'Great taste • Fast delivery'}</Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {menu.map(m => (
          <div key={m.id} className="border rounded-xl overflow-hidden">
            <img src={m.imageUrl || 'https://images.unsplash.com/photo-1548365328-9f547fb095de?q=80&w=1200&auto=format&fit=crop'} className="w-full h-40 object-cover" />
            <div className="p-3">
              <Stack spacing={0.5}>
                <Typography fontWeight={600}>{m.name}</Typography>
                <Typography variant="body2" color="text.secondary">{m.description}</Typography>
                <div className="flex items-center justify-between">
                  <Typography fontWeight={700}>₹{(m.priceCents/100).toFixed(0)}</Typography>
                  <Button size="small" variant="contained" onClick={() => addToCart(m.id)}>Add</Button>
                </div>
              </Stack>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}