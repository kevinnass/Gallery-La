import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export interface Artwork {
  id: string
  user_id: string
  title: string
  description: string | null
  image_url: string
  cover_image_url?: string | null
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface ArtworkUploadData {
  title?: string
  description?: string
  is_public?: boolean
  file: File
  coverImage?: File
}

export interface ArtworkWithProfile extends Artwork {
  profile?: {
    username: string
    avatar_url?: string | null
  }
}

export const useArtworks = () => {
  const { user } = useAuth()
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserArtworks = useCallback(async () => {
    if (!user) {
      setArtworks([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setArtworks(data || [])
    } catch (err) {
      console.error('Error fetching artworks:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch artworks')
    } finally {
      setLoading(false)
    }
  }, [user])

  // Fetch public artworks for a specific user (for visitors)
  const fetchPublicArtworks = useCallback(async (userId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('user_id', userId)
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      setArtworks(data || [])
      return data || []
    } catch (err) {
      console.error('Error fetching public artworks:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch artworks')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch all artworks for a specific user (for owner)
  const fetchArtworksByUserId = useCallback(async (userId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      setArtworks(data || [])
      return data || []
    } catch (err) {
      console.error('Error fetching artworks by user ID:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch artworks')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch all public artworks from all users (for homepage feed)
  const fetchAllPublicArtworks = useCallback(async (limit: number = 50): Promise<ArtworkWithProfile[]> => {
    try {
      setLoading(true)
      setError(null)

      // Fetch public artworks
      const { data: artworksData, error: artworksError } = await supabase
        .from('artworks')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (artworksError) throw artworksError

      if (!artworksData || artworksData.length === 0) {
        return []
      }

      // Get unique user IDs
      const userIds = [...new Set(artworksData.map(a => a.user_id))]

      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds)

      if (profilesError) throw profilesError

      // Create a map of profiles by user_id
      const profilesMap = new Map(
        (profilesData || []).map(p => [p.id, { username: p.username, avatar_url: p.avatar_url }])
      )

      // Merge artworks with profiles
      const artworksWithProfiles: ArtworkWithProfile[] = artworksData.map(artwork => ({
        ...artwork,
        profile: profilesMap.get(artwork.user_id)
      }))

      return artworksWithProfiles
    } catch (err) {
      console.error('Error fetching all public artworks:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch public artworks')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Removed automatic effect to avoid race conditions and double-fetching.
  // Components should call fetchUserArtworks() or other fetch methods explicitly.

  const uploadArtwork = async (data: ArtworkUploadData): Promise<Artwork> => {
    if (!user) throw new Error('No user logged in')

    try {
      setError(null)

      // Generate unique filename
      const fileExt = data.file.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(filePath, data.file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('artworks')
        .getPublicUrl(filePath)

      // Upload cover image if provided (for audio files)
      let coverImageUrl: string | null = null
      if (data.coverImage) {
        const coverExt = data.coverImage.name.split('.').pop()
        const coverFileName = `${crypto.randomUUID()}_cover.${coverExt}`
        const coverFilePath = `${user.id}/${coverFileName}`

        const { error: coverUploadError } = await supabase.storage
          .from('artworks')
          .upload(coverFilePath, data.coverImage, {
            cacheControl: '3600',
            upsert: false,
          })

        if (coverUploadError) {
          // If cover upload fails, delete the main file and throw error
          await supabase.storage.from('artworks').remove([filePath])
          throw coverUploadError
        }

        const { data: { publicUrl: coverPublicUrl } } = supabase.storage
          .from('artworks')
          .getPublicUrl(coverFilePath)
        
        coverImageUrl = coverPublicUrl
      }

      // Create artwork record in database
      const { data: artwork, error: dbError } = await supabase
        .from('artworks')
        .insert({
          user_id: user.id,
          title: data.title || 'Sans titre',
          description: data.description || null,
          image_url: publicUrl,
          cover_image_url: coverImageUrl,
          is_public: data.is_public || false,
        })
        .select()
        .single()

      if (dbError) {
        // If DB insert fails, delete the uploaded files
        await supabase.storage.from('artworks').remove([filePath])
        if (coverImageUrl) {
          const coverPath = coverImageUrl.split('/').slice(-2).join('/')
          await supabase.storage.from('artworks').remove([coverPath])
        }
        throw dbError
      }

      return artwork
    } catch (err) {
      console.error('Error uploading artwork:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload artwork'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateArtwork = async (
    id: string,
    updates: Partial<Pick<Artwork, 'title' | 'description' | 'is_public'>>
  ): Promise<Artwork> => {
    try {
      setError(null)

      const { data, error } = await supabase
        .from('artworks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Update local state
      setArtworks((prev) =>
        prev.map((artwork) => (artwork.id === id ? data : artwork))
      )

      return data
    } catch (err) {
      console.error('Error updating artwork:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update artwork'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const togglePublic = async (id: string): Promise<Artwork> => {
    const artwork = artworks.find((a) => a.id === id)
    if (!artwork) throw new Error('Artwork not found')

    return updateArtwork(id, { is_public: !artwork.is_public })
  }

  const updateCoverImage = async (id: string, coverImageFile: File): Promise<Artwork> => {
    if (!user) throw new Error('No user logged in')

    try {
      setError(null)

      // Upload new cover image
      const coverExt = coverImageFile.name.split('.').pop()
      const coverFileName = `${crypto.randomUUID()}_cover.${coverExt}`
      const coverFilePath = `${user.id}/${coverFileName}`

      const { error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(coverFilePath, coverImageFile, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('artworks')
        .getPublicUrl(coverFilePath)

      // Get current artwork to find old cover
      const { data: currentArtwork } = await supabase
        .from('artworks')
        .select('cover_image_url')
        .eq('id', id)
        .single()

      // Update artwork with new cover URL
      const { data, error: updateError } = await supabase
        .from('artworks')
        .update({ cover_image_url: publicUrl })
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        // If update fails, delete the uploaded cover
        await supabase.storage.from('artworks').remove([coverFilePath])
        throw updateError
      }

      // Delete old cover image if it exists
      if (currentArtwork?.cover_image_url) {
        const oldCoverPath = currentArtwork.cover_image_url.split('/').slice(-2).join('/')
        await supabase.storage.from('artworks').remove([oldCoverPath])
      }

      // Update local state
      setArtworks((prev) =>
        prev.map((artwork) => (artwork.id === id ? data : artwork))
      )

      return data
    } catch (err) {
      console.error('Error updating cover image:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update cover image'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteArtwork = async (id: string): Promise<void> => {
    try {
      setError(null)

      const artwork = artworks.find((a) => a.id === id)
      if (!artwork) throw new Error('Artwork not found')

      // Extract file path from URL
      const url = new URL(artwork.image_url)
      const pathParts = url.pathname.split('/artworks/')
      const filePath = pathParts[1]

      // Delete from database
      const { error: dbError } = await supabase
        .from('artworks')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      // Delete from storage
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('artworks')
          .remove([filePath])

        if (storageError) {
          console.error('Error deleting file from storage:', storageError)
        }
      }

      // Delete cover image if it exists
      if (artwork.cover_image_url) {
        try {
          const coverUrl = new URL(artwork.cover_image_url)
          const coverPathParts = coverUrl.pathname.split('/artworks/')
          const coverPath = coverPathParts[1]
          if (coverPath) {
            await supabase.storage.from('artworks').remove([coverPath])
          }
        } catch (err) {
          console.error('Error parsing cover image URL for deletion:', err)
        }
      }

      // Remove from local state
      setArtworks((prev) => prev.filter((artwork) => artwork.id !== id))
    } catch (err) {
      console.error('Error deleting artwork:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete artwork'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return {
    artworks,
    loading,
    error,
    fetchUserArtworks,
    fetchPublicArtworks,
    fetchAllPublicArtworks,
    fetchArtworksByUserId,
    uploadArtwork,
    updateArtwork,
    updateCoverImage,
    togglePublic,
    deleteArtwork,
    refetch: fetchUserArtworks,
  }
}
