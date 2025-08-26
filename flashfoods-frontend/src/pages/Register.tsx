import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useAppDispatch } from '../utils/hooks'
import { register } from '../features/auth/authSlice'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { MenuItem } from '@mui/material'
import api from '../lib/api'

export default function Register() {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const form = useFormik({
    initialValues: { fullName: '', email: '', password: '', role: 'CUSTOMER' as 'CUSTOMER'|'OWNER' },
    validationSchema: Yup.object({
      fullName: Yup.string().min(2, 'Enter your full name').required('Full name is required'),
      email: Yup.string().email('Enter a valid email').required('Email is required'),
      password: Yup.string().min(6, 'At least 6 characters').required('Password is required')
    }),
    onSubmit: async (values) => {
      try {
        if (values.role === 'OWNER') {
          const res = await api.post('/api/auth/register-owner', { fullName: values.fullName, email: values.email, password: values.password })
          localStorage.setItem('token', res.data.token)
          enqueueSnackbar('Owner account created. Welcome!', { variant: 'success' })
          navigate('/admin')
        } else {
          await dispatch(register({ fullName: values.fullName, email: values.email, password: values.password })).unwrap()
          enqueueSnackbar('Account created. You are now logged in.', { variant: 'success' })
          navigate('/')
        }
      } catch (e: any) {
        enqueueSnackbar('Could not create account', { variant: 'error' })
      }
    }
  })

  return (
    <div className="min-h-[70vh] grid place-items-center bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1600&auto=format&fit=crop)' }}>
      <Card className="w-full max-w-md">
        <CardContent>
          <Typography variant="h5" fontWeight={700} gutterBottom>Create account</Typography>
          <form onSubmit={form.handleSubmit} noValidate>
            <Stack spacing={2}>
              <TextField name="fullName" label="Full name" value={form.values.fullName} onChange={form.handleChange} onBlur={form.handleBlur}
                         error={form.touched.fullName && Boolean(form.errors.fullName)} helperText={form.touched.fullName && form.errors.fullName}
                         InputProps={{ startAdornment: <PersonOutlineIcon className="mr-2 opacity-70" /> }} fullWidth />
              <TextField name="email" label="Email" type="email" value={form.values.email} onChange={form.handleChange} onBlur={form.handleBlur}
                         error={form.touched.email && Boolean(form.errors.email)} helperText={form.touched.email && form.errors.email}
                         InputProps={{ startAdornment: <MailOutlineIcon className="mr-2 opacity-70" /> }} fullWidth />
              <TextField name="password" label="Password" type="password" value={form.values.password} onChange={form.handleChange} onBlur={form.handleBlur}
                         error={form.touched.password && Boolean(form.errors.password)} helperText={form.touched.password && form.errors.password}
                         InputProps={{ startAdornment: <LockOutlinedIcon className="mr-2 opacity-70" /> }} fullWidth />
              <TextField name="role" label="Register as" select value={form.values.role} onChange={form.handleChange} fullWidth>
                <MenuItem value="CUSTOMER">Customer</MenuItem>
                <MenuItem value="OWNER">Owner (Admin)</MenuItem>
              </TextField>
              <Button type="submit" variant="contained" size="large" disabled={form.isSubmitting}>Register</Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}