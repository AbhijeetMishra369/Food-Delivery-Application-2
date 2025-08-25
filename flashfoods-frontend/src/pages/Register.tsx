import { useState } from 'react'
import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'
import { useAppDispatch } from '../utils/hooks'
import { register } from '../features/auth/authSlice'

export default function Register() {
  const dispatch = useAppDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(register({ email, password, fullName }))
  }

  return (
    <div className="min-h-[70vh] grid place-items-center bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=1600&auto=format&fit=crop)' }}>
      <Card className="w-full max-w-md">
        <CardContent>
          <Typography variant="h5" fontWeight={700} gutterBottom>Create account</Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField label="Full name" value={fullName} onChange={e => setFullName(e.target.value)} required fullWidth />
              <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required fullWidth />
              <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required fullWidth />
              <Button type="submit" variant="contained" size="large">Register</Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}