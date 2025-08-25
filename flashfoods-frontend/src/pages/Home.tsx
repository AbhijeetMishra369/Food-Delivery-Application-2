import { useEffect, useState } from 'react'
import { HeroCarousel } from '../components/HeroCarousel'
import { CategoryChips } from '../components/CategoryChips'
import { RestaurantCard } from '../components/RestaurantCard'
import api from '../lib/api'

type Restaurant = { id: number; name: string; description?: string; city?: string; logoUrl?: string; averageRating?: number }

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])

  useEffect(() => {
    api.get('/api/restaurants').then(res => setRestaurants(res.data)).catch(() => setRestaurants([]))
  }, [])

  return (
    <div className="space-y-6">
      <HeroCarousel />
      <CategoryChips />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map(r => (
          <RestaurantCard key={r.id} name={r.name} image={r.logoUrl || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop'} cuisine={r.description || 'Popular picks'} rating={r.averageRating || 4.2} deliveryTimeMin={25} priceForTwo={'₹300 for two'} />
        ))}
      </div>
    </div>
  )
}