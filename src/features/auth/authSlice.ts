import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: false,
  error: null,
}

// Async thunks
export const signInWithOAuth = createAsyncThunk(
  'auth/signInWithOAuth',
  async (provider: 'google' | 'github' | 'discord', { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}`,
        },
      })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('OAuth sign in failed:', error)
      return rejectWithValue((error as AuthError).message)
    }
  }
)

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      return rejectWithValue((error as AuthError).message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
    },
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload
      state.user = action.payload?.user ?? null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // SignIn with OAuth
    builder
      .addCase(signInWithOAuth.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signInWithOAuth.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(signInWithOAuth.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Sign Out
    builder
      .addCase(signOut.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.session = null
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setUser, setSession, clearError } = authSlice.actions
export default authSlice.reducer
