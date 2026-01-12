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

export interface ProfileWithStats extends Profile {
  artwork_count: number
  recent_artworks?: Array<{ id: string; image_url: string; cover_image_url?: string | null }>
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

  const fetchAllArtists = async (): Promise<ProfileWithStats[]> => {
    try {
      // Fetch all public artworks with user_id
      const { data: artworks, error: artworksError } = await supabase
        .from('artworks')
        .select('id, user_id, image_url, cover_image_url, created_at')
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (artworksError) throw artworksError

      if (!artworks || artworks.length === 0) {
        return []
      }

      // Group artworks by user_id and count
      const userStats = new Map<string, { count: number; recentArtworks: typeof artworks }>()
      
      artworks.forEach(artwork => {
        const existing = userStats.get(artwork.user_id)
        if (existing) {
          existing.count++
          if (existing.recentArtworks.length < 3) {
            existing.recentArtworks.push(artwork)
          }
        } else {
          userStats.set(artwork.user_id, {
            count: 1,
            recentArtworks: [artwork]
          })
        }
      })

      // Get unique user IDs
      const userIds = Array.from(userStats.keys())

      // Fetch profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds)

      if (profilesError) throw profilesError

      // Merge profiles with stats
      const artistsWithStats: ProfileWithStats[] = (profiles || []).map(profile => {
        const stats = userStats.get(profile.id)!
        return {
          ...profile,
          artwork_count: stats.count,
          recent_artworks: stats.recentArtworks.map(a => ({
            id: a.id,
            image_url: a.image_url,
            cover_image_url: a.cover_image_url
          }))
        }
      })

      // Sort by artwork count
      artistsWithStats.sort((a, b) => b.artwork_count - a.artwork_count)

      return artistsWithStats
    } catch (err) {
      console.error('Error fetching all artists:', err)
      return []
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
    fetchAllArtists,
    refetch: fetchProfile,
  }
}
