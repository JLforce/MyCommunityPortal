import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useStorage() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const uploadFile = async (bucket, file, fileName) => {
    setUploading(true)
    setError(null)

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)

    setUploading(false)

    if (error) {
      setError(error.message)
      return { error: error.message }
    }

    return { data }
  }

  const downloadFile = async (bucket, fileName) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(fileName)

    if (error) {
      setError(error.message)
      return { error: error.message }
    }

    return { data }
  }

  const deleteFile = async (bucket, fileName) => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName])

    if (error) {
      setError(error.message)
      return { error: error.message }
    }

    return { success: true }
  }

  const getPublicUrl = (bucket, fileName) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  return {
    uploading,
    error,
    uploadFile,
    downloadFile,
    deleteFile,
    getPublicUrl
  }
}
