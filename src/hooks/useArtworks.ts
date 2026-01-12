import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export interface Artwork {
  id: string
  user_id: string
  title: string
  description: string | null
  image_url: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface ArtworkUploadData {
  title?: string
  description?: string
  is_public?: boolean
  file: File
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

  useEffect(() => {
    fetchUserArtworks()
  }, [fetchUserArtworks])

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

      // Create artwork record in database
      const { data: artwork, error: dbError } = await supabase
        .from('artworks')
        .insert({
          user_id: user.id,
          title: data.title || 'Sans titre',
          description: data.description || null,
          image_url: publicUrl,
          is_public: data.is_public || false,
        })
        .select()
        .single()

      if (dbError) {
        // If DB insert fails, delete the uploaded file
        await supabase.storage.from('artworks').remove([filePath])
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
    fetchArtworksByUserId,
    uploadArtwork,
    updateArtwork,
    togglePublic,
    deleteArtwork,
    refetch: fetchUserArtworks,
  }
}
