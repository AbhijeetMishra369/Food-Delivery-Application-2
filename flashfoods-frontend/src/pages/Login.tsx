import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useAppDispatch } from '../utils/hooks'
import { login } from '../features/auth/authSlice'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'

export default function Login() {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const form = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Enter a valid email').required('Email is required'),
      password: Yup.string().min(6, 'At least 6 characters').required('Password is required')
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(login(values)).unwrap()
        enqueueSnackbar('Logged in successfully', { variant: 'success' })
        navigate('/')
      } catch (e: any) {
        enqueueSnackbar('Invalid email or password', { variant: 'error' })
      }
    }
  })

  return (
    <div className="min-h-[70vh] grid place-items-center bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=1600&auto=format&fit=crop)' }}>
      <Card className="w-full max-w-md">
        <CardContent>
          <Typography variant="h5" fontWeight={700} gutterBottom>Welcome back</Typography>
          <form onSubmit={form.handleSubmit} noValidate>
            <Stack spacing={2}>
              <TextField name="email" label="Email" type="email" value={form.values.email} onChange={form.handleChange} onBlur={form.handleBlur}
                         error={form.touched.email && Boolean(form.errors.email)} helperText={form.touched.email && form.errors.email}
                         InputProps={{ startAdornment: <MailOutlineIcon className="mr-2 opacity-70" /> }} fullWidth />
              <TextField name="password" label="Password" type="password" value={form.values.password} onChange={form.handleChange} onBlur={form.handleBlur}
                         error={form.touched.password && Boolean(form.errors.password)} helperText={form.touched.password && form.errors.password}
                         InputProps={{ startAdornment: <LockOutlinedIcon className="mr-2 opacity-70" /> }} fullWidth />
              <Button type="submit" variant="contained" size="large" disabled={form.isSubmitting}>Login</Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}