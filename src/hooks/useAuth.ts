import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  signInWithOAuth,
  signOut as signOutAction,
  clearError,
} from '@/features/auth/authSlice'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, session, loading, error } = useAppSelector((state) => state.auth)

  const loginWithGoogle = () => dispatch(signInWithOAuth('google'))
  const loginWithGithub = () => dispatch(signInWithOAuth('github'))
  const loginWithDiscord = () => dispatch(signInWithOAuth('discord'))

  const logout = async () => {
    return dispatch(signOutAction())
  }

  const clearAuthError = () => {
    dispatch(clearError())
  }

  return {
    user,
    session,
    loading,
    error,
    loginWithGoogle,
    loginWithGithub,
    loginWithDiscord,
    logout,
    clearAuthError,
    isAuthenticated: !!user,
  }
}
