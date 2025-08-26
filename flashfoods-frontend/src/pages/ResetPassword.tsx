import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import api from '../lib/api'
import { useSnackbar } from 'notistack'

export default function ResetPassword() {
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const { enqueueSnackbar } = useSnackbar()

  const submit = async () => {
    try {
      await api.post('/api/auth/reset-password', { token, newPassword: password })
      enqueueSnackbar('Password updated. You can log in now.', { variant: 'success' })
    } catch (e: any) {
      enqueueSnackbar(e?.response?.data?.message || 'Invalid or expired token', { variant: 'error' })
    }
  }

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <Card className="w-full max-w-md">
        <CardContent>
          <Typography variant="h5" fontWeight={700} gutterBottom>Reset Password</Typography>
          <Stack spacing={2}>
            <TextField label="Reset token" value={token} onChange={e => setToken(e.target.value)} fullWidth />
            <TextField label="New password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth />
            <Button variant="contained" onClick={submit}>Reset</Button>
          </Stack>
        </CardContent>
      </Card>
    </div>
  )
}

