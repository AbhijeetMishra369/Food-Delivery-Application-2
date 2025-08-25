import { useEffect, useState } from 'react'
import { RestaurantCard } from '../components/RestaurantCard'
import api from '../lib/api'

type Favorite = { id: number; restaurant: { id: number; name: string; logoUrl?: string; description?: string; averageRating?: number } }

export default function Favorites() {
  const [favs, setFavs] = useState<Favorite[]>([])
  useEffect(() => { api.get('/api/favorites').then(res => setFavs(res.data)) }, [])
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {favs.map(f => (
        <RestaurantCard key={f.id} name={f.restaurant.name} image={f.restaurant.logoUrl || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop'} cuisine={f.restaurant.description || 'Popular'} rating={f.restaurant.averageRating || 4.2} deliveryTimeMin={25} priceForTwo={'₹300 for two'} />
      ))}
    </div>
  )
}