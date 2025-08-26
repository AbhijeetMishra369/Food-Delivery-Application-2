import { Button, Card, CardContent, Divider, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import api from '../lib/api'
import { useSnackbar } from 'notistack'

type Address = { id: number; line1: string; line2?: string; city: string; state: string; pincode: string; landmark?: string; default?: boolean }

export default function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [form, setForm] = useState<Address>({ id: 0, line1: '', city: '', state: '', pincode: '' } as Address)
  const { enqueueSnackbar } = useSnackbar()

  const load = () => api.get('/api/addresses').then(res => setAddresses(res.data)).catch(() => setAddresses([]))
  useEffect(() => { load() }, [])

  const save = async () => {
    try {
      if (!form.line1 || !form.city || !form.state || !form.pincode) {
        enqueueSnackbar('Please fill required fields', { variant: 'warning' })
        return
      }
      const payload = { ...form, isDefault: form.default }
      if (form.id) {
        await api.put(`/api/addresses/${form.id}`, payload)
        enqueueSnackbar('Address updated', { variant: 'success' })
      } else {
        await api.post('/api/addresses', payload)
        enqueueSnackbar('Address added', { variant: 'success' })
      }
      setForm({ id: 0, line1: '', city: '', state: '', pincode: '' } as Address)
      load()
    } catch { enqueueSnackbar('Failed to save address', { variant: 'error' }) }
  }

  const edit = (a: Address) => setForm(a)
  const remove = async (id: number) => { await api.delete(`/api/addresses/${id}`); load() }

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-3">
        <Typography variant="h6" fontWeight={700}>Saved Addresses</Typography>
        {addresses.map(a => (
          <Card key={a.id}>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{a.line1}{a.line2 ? `, ${a.line2}` : ''}</div>
                <div className="text-sm text-gray-600">{a.city}, {a.state} - {a.pincode}</div>
                {a.landmark && <div className="text-sm text-gray-500">Landmark: {a.landmark}</div>}
              </div>
              <Stack direction="row" spacing={1}>
                <Button size="small" onClick={() => edit(a)}>Edit</Button>
                <Button size="small" color="error" onClick={() => remove(a.id)}>Delete</Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="space-y-3">
        <Typography variant="h6" fontWeight={700}>{form.id ? 'Edit Address' : 'Add Address'}</Typography>
        <Divider />
        <Stack spacing={1}>
          <TextField size="small" label="Line 1" value={form.line1} onChange={e => setForm(f => ({ ...f, line1: e.target.value }))} fullWidth />
          <TextField size="small" label="Line 2" value={form.line2 || ''} onChange={e => setForm(f => ({ ...f, line2: e.target.value }))} fullWidth />
          <TextField size="small" label="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} fullWidth />
          <TextField size="small" label="State" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} fullWidth />
          <TextField size="small" label="Pincode" value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} fullWidth />
          <TextField size="small" label="Landmark" value={form.landmark || ''} onChange={e => setForm(f => ({ ...f, landmark: e.target.value }))} fullWidth />
          <Button variant="contained" onClick={save}>{form.id ? 'Update' : 'Save'}</Button>
        </Stack>
      </div>
    </div>
  )
}

