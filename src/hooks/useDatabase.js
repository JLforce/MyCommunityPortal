import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useDatabase(tableName, select = '*') {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [tableName, select])

  const fetchData = async () => {
    setLoading(true)
    const { data: fetchedData, error } = await supabase
      .from(tableName)
      .select(select)

    if (error) {
      setError(error.message)
    } else {
      setData(fetchedData)
    }
    setLoading(false)
  }

  const insertData = async (newData) => {
    const { data: insertedData, error } = await supabase
      .from(tableName)
      .insert(newData)
      .select()

    if (error) {
      setError(error.message)
      return { error: error.message }
    }

    setData(prev => [...prev, ...insertedData])
    return { data: insertedData }
  }

  const updateData = async (id, updates) => {
    const { data: updatedData, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq('id', id)
      .select()

    if (error) {
      setError(error.message)
      return { error: error.message }
    }

    setData(prev => prev.map(item => item.id === id ? updatedData[0] : item))
    return { data: updatedData }
  }

  const deleteData = async (id) => {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)

    if (error) {
      setError(error.message)
      return { error: error.message }
    }

    setData(prev => prev.filter(item => item.id !== id))
    return { success: true }
  }

  return {
    data,
    loading,
    error,
    fetchData,
    insertData,
    updateData,
    deleteData
  }
}
