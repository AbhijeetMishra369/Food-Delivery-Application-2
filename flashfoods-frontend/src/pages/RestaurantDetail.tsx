import { Button, Rating, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/api'
import { useSnackbar } from 'notistack'

type Restaurant = { id: number; name: string; description?: string; logoUrl?: string }
type MenuItem = { id: number; name: string; description?: string; priceCents: number; imageUrl?: string }

type Review = { id: number; rating: number; comment: string }

export default function RestaurantDetail() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState<number | null>(5)
  const [comment, setComment] = useState('')
  const { enqueueSnackbar } = useSnackbar()

  const load = () => {
    if (!id) return
    api.get(`/api/restaurants/${id}`).then(res => setRestaurant(res.data))
    api.get(`/api/menu/restaurant/${id}`).then(res => setMenu(res.data))
    api.get(`/api/reviews/restaurant/${id}`).then(res => setReviews(res.data))
  }

  useEffect(() => { load() }, [id])

  const addToCart = (menuItemId: number) => {
    api.post(`/api/cart/add/${menuItemId}?qty=1`).then(() => enqueueSnackbar('Added to cart', { variant: 'success' })).catch(() => {})
  }

  const submitReview = async () => {
    if (!id) return
    if (!rating || rating < 1) { enqueueSnackbar('Please select a rating', { variant: 'warning' }); return }
    if (comment.trim().length < 5) { enqueueSnackbar('Please write a short comment (min 5 chars)', { variant: 'warning' }); return }
    try {
      await api.post(`/api/reviews/restaurant/${id}`, { rating, comment })
      setComment('')
      setRating(5)
      enqueueSnackbar('Thanks for the review!', { variant: 'success' })
      load()
    } catch (e: any) {
      enqueueSnackbar(e?.response?.data?.message || 'Could not submit review', { variant: 'error' })
    }
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

      <div className="space-y-3">
        <Typography variant="h6" fontWeight={700}>Ratings & Reviews</Typography>
        <div className="border rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-3">
            <Rating value={rating} onChange={(_, v) => setRating(v)} />
            <TextField size="small" placeholder="Share your experience" value={comment} onChange={e => setComment(e.target.value)} fullWidth />
            <Button variant="contained" onClick={submitReview}>Submit</Button>
          </div>
          {reviews.length === 0 && <div className="text-sm text-gray-600">No reviews yet. Be the first!</div>}
          {reviews.map(r => (
            <div key={r.id} className="border rounded p-2">
              <div className="flex items-center gap-2"><Rating value={r.rating} readOnly size="small" /><Typography variant="body2" color="text.secondary">{r.comment}</Typography></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}