import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import type { Artwork } from './useArtworks'

export interface Exhibition {
  id: string
  user_id: string
  title: string
  description: string | null
  cover_image_url: string | null
  is_public: boolean
  layout: 'grid' | 'masonry' | 'editorial'
  created_at: string
  updated_at: string
}

export interface ExhibitionArtwork extends Artwork {
  display_order: number
}

export interface ExhibitionWithArtworks extends Exhibition {
  artworks: ExhibitionArtwork[]
}

export const useExhibitions = () => {
  const { user } = useAuth()
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchExhibitionsByUserId = useCallback(async (userId: string) => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('exhibitions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setExhibitions(data || [])
      return data || []
    } catch (err) {
      console.error('Error fetching exhibitions:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch exhibitions')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAllPublicExhibitions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('exhibitions')
        .select('*, profiles(username, full_name)')
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setExhibitions(data || [])
      return data || []
    } catch (err) {
      console.error('Error fetching all public exhibitions:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch exhibitions')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchPublicExhibitions = useCallback(async (userId: string) => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('exhibitions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setExhibitions(data || [])
      return data || []
    } catch (err) {
      console.error('Error fetching public exhibitions:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch exhibitions')
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchExhibitionDetails = useCallback(async (exhibitionId: string): Promise<ExhibitionWithArtworks | null> => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch exhibition info
      const { data: exhibition, error: exError } = await supabase
        .from('exhibitions')
        .select('*')
        .eq('id', exhibitionId)
        .single()

      if (exError) throw exError

      // Fetch artworks via junction table
      const { data: artworkLinks, error: linksError } = await supabase
        .from('exhibition_artworks')
        .select('artwork_id, display_order, artworks(*)')
        .eq('exhibition_id', exhibitionId)
        .order('display_order', { ascending: true })

      if (linksError) throw linksError

      const artworks = (artworkLinks || []).map(link => ({
        ...(link.artworks as any),
        display_order: link.display_order
      })) as ExhibitionArtwork[]

      return {
        ...exhibition,
        artworks
      }
    } catch (err) {
      console.error('Error fetching exhibition details:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch exhibition details')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const createExhibition = async (data: Partial<Exhibition>) => {
    if (!user) throw new Error('No user logged in')
    try {
      const { data: exhibition, error } = await supabase
        .from('exhibitions')
        .insert({
          ...data,
          user_id: user.id
        })
        .select()
        .single()

      if (error) throw error
      setExhibitions(prev => [exhibition, ...prev])
      return exhibition
    } catch (err) {
      console.error('Error creating exhibition:', err)
      throw err
    }
  }

  const updateExhibition = async (id: string, updates: Partial<Exhibition>) => {
    try {
      const { data: exhibition, error } = await supabase
        .from('exhibitions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setExhibitions(prev => prev.map(ex => ex.id === id ? exhibition : ex))
      return exhibition
    } catch (err) {
      console.error('Error updating exhibition:', err)
      throw err
    }
  }

  const deleteExhibition = async (id: string) => {
    try {
      const { error } = await supabase
        .from('exhibitions')
        .delete()
        .eq('id', id)

      if (error) throw error
      setExhibitions(prev => prev.filter(ex => ex.id !== id))
    } catch (err) {
      console.error('Error deleting exhibition:', err)
      throw err
    }
  }

  const addArtworksToExhibition = async (exhibitionId: string, artworkIds: string[]) => {
    try {
      // Get current max order
      const { data: currentArtworks } = await supabase
        .from('exhibition_artworks')
        .select('display_order')
        .eq('exhibition_id', exhibitionId)
        .order('display_order', { ascending: false })
        .limit(1)

      const startOrder = currentArtworks && currentArtworks.length > 0 ? currentArtworks[0].display_order + 1 : 0

      const inserts = artworkIds.map((id, index) => ({
        exhibition_id: exhibitionId,
        artwork_id: id,
        display_order: startOrder + index
      }))

      const { error } = await supabase
        .from('exhibition_artworks')
        .insert(inserts)

      if (error) throw error
    } catch (err) {
      console.error('Error adding artworks to exhibition:', err)
      throw err
    }
  }

  const removeArtworkFromExhibition = async (exhibitionId: string, artworkId: string) => {
    try {
      const { error } = await supabase
        .from('exhibition_artworks')
        .delete()
        .eq('exhibition_id', exhibitionId)
        .eq('artwork_id', artworkId)

      if (error) throw error
    } catch (err) {
      console.error('Error removing artwork from exhibition:', err)
      throw err
    }
  }

  const updateArtworkOrder = async (exhibitionId: string, artworkId: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('exhibition_artworks')
        .update({ display_order: newOrder })
        .eq('exhibition_id', exhibitionId)
        .eq('artwork_id', artworkId)

      if (error) throw error
    } catch (err) {
      console.error('Error updating artwork order:', err)
      throw err
    }
  }

  return {
    exhibitions,
    loading,
    error,
    fetchExhibitionsByUserId,
    fetchAllPublicExhibitions,
    fetchPublicExhibitions,
    fetchExhibitionDetails,
    createExhibition,
    updateExhibition,
    deleteExhibition,
    addArtworksToExhibition,
    removeArtworkFromExhibition,
    updateArtworkOrder
  }
}
