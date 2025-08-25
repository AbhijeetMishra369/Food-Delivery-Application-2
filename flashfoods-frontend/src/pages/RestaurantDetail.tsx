import { Button, Stack, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

const menu = [
  { id: 1, name: 'Margherita Pizza', price: 199, image: 'https://images.unsplash.com/photo-1548365328-9f547fb095de?q=80&w=1200&auto=format&fit=crop', desc: 'Classic cheese & basil' },
  { id: 2, name: 'Tandoori Chicken', price: 249, image: 'https://images.unsplash.com/photo-1604908176997-431632bed5d8?q=80&w=1200&auto=format&fit=crop', desc: 'Smoky and juicy' },
  { id: 3, name: 'Veg Hakka Noodles', price: 179, image: 'https://images.unsplash.com/photo-1546069901-eacef0df6022?q=80&w=1200&auto=format&fit=crop', desc: 'Wok tossed noodles' },
]

export default function RestaurantDetail() {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <div className="h-56 md:h-72 w-full rounded-xl overflow-hidden relative">
        <img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1600&auto=format&fit=crop" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-5 text-white">
          <Typography variant="h5" fontWeight={700}>Restaurant #{id}</Typography>
          <Typography variant="body2" className="opacity-90">Fast delivery • Great taste</Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {menu.map(m => (
          <div key={m.id} className="border rounded-xl overflow-hidden">
            <img src={m.image} className="w-full h-40 object-cover" />
            <div className="p-3">
              <Stack spacing={0.5}>
                <Typography fontWeight={600}>{m.name}</Typography>
                <Typography variant="body2" color="text.secondary">{m.desc}</Typography>
                <div className="flex items-center justify-between">
                  <Typography fontWeight={700}>₹{m.price}</Typography>
                  <Button size="small" variant="contained">Add</Button>
                </div>
              </Stack>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}