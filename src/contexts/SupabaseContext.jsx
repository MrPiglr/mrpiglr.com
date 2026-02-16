import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from './SupabaseAuthContext';

const SupabaseContext = createContext();

export const useSupabase = () => {
  return useContext(SupabaseContext);
};

export const SupabaseProvider = ({ children }) => {
  const { user } = useAuth();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (tableName, filters = [], select = '*') => {
    let query = supabase.from(tableName).select(select);
    filters.forEach(filter => {
      query = query.eq(filter.column, filter.value);
    });
    const { data, error } = await query;
    if (error) {
      console.error(`Error fetching ${tableName}:`, error);
      return [];
    }
    return data;
  }, []);

  const addData = useCallback(async (tableName, rowData, select = '*') => {
    const { data, error } = await supabase.from(tableName).insert(rowData).select(select);
    if (error) {
      console.error(`Error adding to ${tableName}:`, error);
      throw error;
    }
    return data[0];
  }, []);

  const updateData = useCallback(async (tableName, rowId, updatedData, select = '*') => {
    const { data, error } = await supabase.from(tableName).update(updatedData).eq('id', rowId).select(select);
    if (error) {
      console.error(`Error updating ${tableName}:`, error);
      throw error;
    }
    return data[0];
  }, []);

  const deleteData = useCallback(async (tableName, rowId) => {
    const { error } = await supabase.from(tableName).delete().eq('id', rowId);
    if (error) {
      console.error(`Error deleting from ${tableName}:`, error);
      throw error;
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      if (user) {
        // Example: load user-specific data here if needed
        // const projects = await fetchData('projects', [{ column: 'user_id', value: user.id }]);
        // setData(prev => ({ ...prev, projects }));
      }
      setLoading(false);
    };
    loadInitialData();
  }, [user, fetchData]);

  const value = {
    data,
    loading,
    fetchData,
    addData,
    updateData,
    deleteData,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};