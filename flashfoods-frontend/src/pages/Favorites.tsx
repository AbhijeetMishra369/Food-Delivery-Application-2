import { RestaurantCard } from '../components/RestaurantCard'

const favorites = [
  { name: 'Pasta Factory', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop', cuisine: 'Italian, Pizza', rating: 4.5, deliveryTimeMin: 20, priceForTwo: '₹400 for two' },
  { name: 'Sweet Cravings', image: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=1200&auto=format&fit=crop', cuisine: 'Desserts, Bakery', rating: 4.6, deliveryTimeMin: 22, priceForTwo: '₹250 for two' }
]

export default function Favorites() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {favorites.map(r => (
        <RestaurantCard key={r.name} {...r} />
      ))}
    </div>
  )
}