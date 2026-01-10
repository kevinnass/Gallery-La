import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  signInWithMagicLink,
  signInWithGithub,
  signOut as signOutAction,
} from '@/features/auth/authSlice'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, session, loading, error } = useAppSelector((state) => state.auth)

  const sendMagicLink = async (email: string) => {
    return dispatch(signInWithMagicLink(email))
  }

  const loginWithGithub = async () => {
    return dispatch(signInWithGithub())
  }

  const logout = async () => {
    return dispatch(signOutAction())
  }

  return {
    user,
    session,
    loading,
    error,
    sendMagicLink,
    loginWithGithub,
    logout,
    isAuthenticated: !!user,
  }
}
