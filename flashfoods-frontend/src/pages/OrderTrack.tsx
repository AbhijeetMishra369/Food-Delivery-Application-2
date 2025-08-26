import { Chip, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import api from '../lib/api'

type Track = { id: number; status: string; eta: string }

export default function OrderTrack() {
  const [track, setTrack] = useState<Track | null>(null)
  const [orderId, setOrderId] = useState<number | null>(null)

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    const id = Number(new URLSearchParams(hash || window.location.search).get('orderId'))
    if (id) setOrderId(id)
  }, [])

  useEffect(() => {
    if (!orderId) return
    const fetch = () => api.get(`/api/orders/${orderId}/track`).then(res => setTrack(res.data)).catch(() => {})
    fetch()
    const t = setInterval(fetch, 5000)
    return () => clearInterval(t)
  }, [orderId])

  return (
    <div className="space-y-3">
      <Typography variant="h6" fontWeight={700}>Order Tracking</Typography>
      {!track && <div className="text-gray-600">Loading...</div>}
      {track && (
        <div className="border rounded-lg p-3 flex items-center justify-between">
          <div>
            <div className="font-semibold">Order #{track.id}</div>
            <div className="text-sm text-gray-600">Estimated arrival: {track.eta}</div>
          </div>
          <Stack direction="row" spacing={1}>
            <Chip label={track.status} color={track.status === 'DELIVERED' ? 'success' : 'warning'} />
          </Stack>
        </div>
      )}
      <div className="rounded overflow-hidden">
        <img src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1200&auto=format&fit=crop" className="w-full h-64 object-cover" />
      </div>
    </div>
  )
}

