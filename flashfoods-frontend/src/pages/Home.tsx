import { HeroCarousel } from '../components/HeroCarousel'
import { CategoryChips } from '../components/CategoryChips'
import { RestaurantCard } from '../components/RestaurantCard'

const restaurants = [
  { name: 'Spice Garden', image: 'https://images.unsplash.com/photo-1604908176997-431632bed5d8?q=80&w=1200&auto=format&fit=crop', cuisine: 'North Indian, Biryani', rating: 4.4, deliveryTimeMin: 25, priceForTwo: '₹300 for two' },
  { name: 'Wok n Roll', image: 'https://images.unsplash.com/photo-1548848221-0c4d4a406cd6?q=80&w=1200&auto=format&fit=crop', cuisine: 'Chinese, Thai', rating: 4.2, deliveryTimeMin: 30, priceForTwo: '₹350 for two' },
  { name: 'Pasta Factory', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop', cuisine: 'Italian, Pizza', rating: 4.5, deliveryTimeMin: 20, priceForTwo: '₹400 for two' },
  { name: 'Sweet Cravings', image: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=1200&auto=format&fit=crop', cuisine: 'Desserts, Bakery', rating: 4.6, deliveryTimeMin: 22, priceForTwo: '₹250 for two' },
  { name: 'Green Bowl', image: 'https://images.unsplash.com/photo-1546069901-eacef0df6022?q=80&w=1200&auto=format&fit=crop', cuisine: 'Healthy, Salads', rating: 4.3, deliveryTimeMin: 18, priceForTwo: '₹280 for two' },
  { name: 'Tandoori Hub', image: 'https://images.unsplash.com/photo-1604908176997-431632bed5d8?q=80&w=1200&auto=format&fit=crop', cuisine: 'Tandoor, Grill', rating: 4.1, deliveryTimeMin: 35, priceForTwo: '₹320 for two' },
]

export default function Home() {
  return (
    <div className="space-y-6">
      <HeroCarousel />
      <CategoryChips />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map(r => (
          <RestaurantCard key={r.name} {...r} />
        ))}
      </div>
    </div>
  )
}