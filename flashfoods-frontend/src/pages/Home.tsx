import { useEffect, useState } from 'react'
import { TextField, Typography } from '@mui/material'
import { HeroCarousel } from '../components/HeroCarousel'
import { CategoryChips } from '../components/CategoryChips'
import { RestaurantCard } from '../components/RestaurantCard'
import api from '../lib/api'

type Restaurant = { id: number; name: string; description?: string; city?: string; logoUrl?: string; averageRating?: number }
type MenuItem = { id: number; name: string; imageUrl?: string; priceCents: number }

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [popular, setPopular] = useState<MenuItem[]>([])
  const [q, setQ] = useState('')

  const load = () => {
    const qs = q.trim()
    const url = qs ? `/api/restaurants?q=${encodeURIComponent(qs)}` : '/api/restaurants'
    api.get(url).then(res => setRestaurants(res.data)).catch(() => setRestaurants([]))
    api.get('/api/menu/popular').then(res => setPopular(res.data)).catch(() => setPopular([]))
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6">
      <HeroCarousel />
      <div className="flex items-center gap-3">
        <CategoryChips />
        <TextField size="small" placeholder="Search restaurants or cuisines" value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' ? load() : undefined} fullWidth />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map(r => (
          <RestaurantCard key={r.id} name={r.name} image={r.logoUrl || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop'} cuisine={r.description || 'Popular picks'} rating={r.averageRating || 4.2} deliveryTimeMin={25} priceForTwo={'₹300 for two'} />
        ))}
      </div>
      <div className="space-y-2">
        <Typography variant="h6" fontWeight={700}>Popular Dishes</Typography>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {popular.map(p => (
            <div key={p.id} className="border rounded-lg overflow-hidden">
              <img src={p.imageUrl || 'https://images.unsplash.com/photo-1548365328-9f547fb095de?q=80&w=800&auto=format&fit=crop'} className="w-full h-28 object-cover" />
              <div className="p-2 text-sm">
                <div className="font-semibold truncate">{p.name}</div>
                <div className="text-gray-600">₹{(p.priceCents/100).toFixed(0)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}