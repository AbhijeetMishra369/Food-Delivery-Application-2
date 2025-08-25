import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../lib/api'

export type User = { email: string; fullName: string; role: 'ADMIN'|'OWNER'|'CUSTOMER' }

export type AuthState = {
  token: string | null
  user: User | null
  status: 'idle'|'loading'|'succeeded'|'failed'
  error?: string
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: null,
  status: 'idle'
}

export const login = createAsyncThunk('auth/login', async (payload: { email: string; password: string }) => {
  const { data } = await api.post('/api/auth/login', payload)
  return data as { token: string }
})

export const register = createAsyncThunk('auth/register', async (payload: { email: string; password: string; fullName: string }) => {
  const { data } = await api.post('/api/auth/register', payload)
  return data as { token: string }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
    },
    setToken(state, action) {
      state.token = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.status = 'loading' })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload.token
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(login.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message })
      .addCase(register.pending, (state) => { state.status = 'loading' })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload.token
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(register.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message })
  }
})

export const { logout, setToken } = authSlice.actions
export default authSlice.reducer