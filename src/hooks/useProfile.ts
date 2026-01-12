import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export interface Profile {
  id: string
  username: string | null
  bio: string | null
  specialty: string | null
  instagram_handle: string | null
  location: string | null
  created_at?: string
  updated_at?: string
}

export const useProfile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch profile on user change
  useEffect(() => {
    if (user) {
      fetchProfile()
    } else {
      setProfile(null)
      setLoading(false)
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        // If profile doesn't exist, that's ok (will be created later)
        if (error.code === 'PGRST116') {
          setProfile(null)
        } else {
          throw error
        }
      } else {
        setProfile(data)
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  const isProfileComplete = () => {
    return profile && profile.username && profile.specialty
  }

  const checkUsernameAvailable = useCallback(async (username: string): Promise<boolean> => {
    if (!username || username.trim().length === 0) return false

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.trim())
        .maybeSingle()

      if (error) throw error

      // If data exists and it's not the current user's profile, username is taken
      if (data && data.username !== profile?.username) {
        return false
      }

      return true
    } catch (err) {
      console.error('Error checking username:', err)
      return false
    }
  }, [profile?.username])

  // Get profile by username (for public viewing)
  const getProfileByUsername = useCallback(async (username: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found
          return null
        }
        throw error
      }

      return data
    } catch (err) {
      console.error('Error fetching profile by username:', err)
      return null
    }
  }, [])

  const createOrUpdateProfile = async (data: {
    username: string
    bio?: string
    specialty: string
    instagram_handle?: string
    location?: string
  }) => {
    if (!user) throw new Error('No user logged in')

    try {
      setLoading(true)
      setError(null)

      const profileData = {
        id: user.id,
        username: data.username.trim(),
        bio: data.bio?.trim() || null,
        specialty: data.specialty,
        instagram_handle: data.instagram_handle?.trim() || null,
        location: data.location?.trim() || null,
        updated_at: new Date().toISOString(),
      }

      const { data: result, error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' })
        .select()
        .single()

      if (error) throw error

      setProfile(result)
      return result
    } catch (err) {
      console.error('Error updating profile:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    profile,
    loading,
    error,
    isProfileComplete: isProfileComplete(),
    checkUsernameAvailable,
    getProfileByUsername,
    createOrUpdateProfile,
    refetch: fetchProfile,
  }
}
