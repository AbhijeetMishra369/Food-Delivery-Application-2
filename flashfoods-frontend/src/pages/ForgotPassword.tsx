import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import api from '../lib/api'
import { useSnackbar } from 'notistack'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const { enqueueSnackbar } = useSnackbar()

  const submit = async () => {
    try {
      await api.post('/api/auth/forgot-password', { email })
      enqueueSnackbar('If the email exists, a reset link will be sent', { variant: 'success' })
    } catch { enqueueSnackbar('Please try again later', { variant: 'error' }) }
  }

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <Card className="w-full max-w-md">
        <CardContent>
          <Typography variant="h5" fontWeight={700} gutterBottom>Forgot Password</Typography>
          <Stack spacing={2}>
            <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
            <Button variant="contained" onClick={submit}>Send reset</Button>
          </Stack>
        </CardContent>
      </Card>
    </div>
  )
}

