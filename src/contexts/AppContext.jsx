
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useSite } from '@/contexts/SiteContext';
import { supabase } from '@/lib/customSupabaseClient';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

const contentTables = ['social_links', 'music', 'creations', 'books', 'products'];
const nonSiteContentTables = ['blog_posts'];

export const AppProvider = ({ children }) => {
  const { siteId, loading: loadingSite } = useSite();
  
  // Use a ref to store data to prevent re-renders if the data structure is identical
  const [data, setData] = useState({
    social_links: [],
    music: [],
    creations: [],
    books: [],
    products: [],
    blog_posts: [],
  });
  
  const [loading, setLoading] = useState(true);
  const fetchedOnce = React.useRef(false);

  const fetchData = useCallback(async (isRetry = false) => {
    if (!siteId) return;
    
    // Avoid double fetching if we already have data and siteId hasn't changed, unless forced
    if (fetchedOnce.current && !isRetry) {
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
      let siteDataPromises = [];
      if (siteId) {
        siteDataPromises = contentTables.map(table =>
          supabase.from(table).select('*').eq('site_id', siteId)
        );
      }

      const blogPostsPromise = supabase.from('blog_posts').select('*');

      const results = await Promise.all([...siteDataPromises, blogPostsPromise]);
      const errors = results.map(r => r.error).filter(Boolean);

      if (errors.length > 0) {
        errors.forEach(error => console.error(`Error fetching data:`, error));
      }

      const [social_links, music, creations, books, products] = siteId ? results.slice(0, -1).map(r => r.data || []) : [[], [], [], [], []];
      const blog_posts = results[results.length - 1].data || [];
      
      const fetchedData = { social_links, music, creations, books, products };

      if (siteId) {
        const isDataEmpty = Object.values(fetchedData).every(arr => Array.isArray(arr) && arr.length === 0);
        
        if (isDataEmpty && !isRetry) {
          console.log('No site data found, attempting to populate with initial content...');
          const { error: populateError } = await supabase.rpc('populate_initial_site_data', { p_site_id: siteId });
          if (populateError) {
            console.error('Error populating initial data:', populateError);
          } else {
            console.log('Population successful, re-fetching data...');
            await fetchData(true);
            return;
          }
        }
      }

      setData({
        social_links: (social_links || []).sort((a,b) => a.display_order - b.display_order),
        music: (music || []).sort((a,b) => a.display_order - b.display_order),
        creations: (creations || []).sort((a,b) => a.display_order - b.display_order),
        books: (books || []).sort((a,b) => a.display_order - b.display_order),
        products: (products || []).sort((a,b) => a.display_order - b.display_order),
        blog_posts: (blog_posts || []).sort((a, b) => new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at)),
      });
      
      fetchedOnce.current = true;

    } catch (e) {
      console.error('Catastrophic error fetching data:', e);
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    if (!loadingSite && siteId) {
      fetchData();
    }
  }, [fetchData, loadingSite, siteId]);

  const generateAndSetImageUrl = async (item) => {
    if (item.image_prompt && !item.image_url) {
      try {
        const { data, error } = await supabase.functions.invoke('generate-image-from-prompt', {
          body: { prompt: item.image_prompt },
        });
        if (error) throw error;
        item.image_url = data.imageUrl;
      } catch (e) {
        console.error('Error generating image from prompt:', e);
        item.image_url = 'https://via.placeholder.com/600x400.png?text=Image+Generation+Failed';
      }
    }
    return item;
  };

  const getTableAndKey = (type) => {
    const map = {
      socials: { table: 'social_links', key: 'social_links' },
      music: { table: 'music', key: 'music' },
      creations: { table: 'creations', key: 'creations' },
      books: { table: 'books', key: 'books' },
      products: { table: 'products', key: 'products' },
      blog_posts: { table: 'blog_posts', key: 'blog_posts' },
    };
    return map[type];
  };

  const addData = useCallback(async (type, newItem) => {
    const mapping = getTableAndKey(type);
    if (!mapping) throw new Error('Invalid type');
    const { table: tableName, key: dataKey } = mapping;

    let itemToInsert = { ...newItem };
    if (!nonSiteContentTables.includes(tableName)) {
        if (!siteId) throw new Error('Missing siteId for site-specific content');
        itemToInsert.site_id = siteId;
    }
    
    delete itemToInsert.id;

    await generateAndSetImageUrl(itemToInsert);

    const { data: insertedData, error } = await supabase
      .from(tableName)
      .insert(itemToInsert)
      .select()
      .single();

    if (error) throw error;

    setData(prev => ({
      ...prev,
      [dataKey]: [...(prev[dataKey] || []), insertedData].sort((a, b) => {
          if(dataKey === 'blog_posts') return new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at);
          return a.display_order - b.display_order;
        }),
    }));
    return insertedData;
  }, [siteId]);

  const updateData = useCallback(async (type, updatedItem) => {
    const mapping = getTableAndKey(type);
    if (!mapping) throw new Error('Invalid type');
    const { table: tableName, key: dataKey } = mapping;

    let itemToUpdate = { ...updatedItem };
    if (!nonSiteContentTables.includes(tableName)) {
        if (!siteId) throw new Error('Missing siteId for site-specific content');
        itemToUpdate.site_id = siteId;
    }
    
    if ('youtube_id' in itemToUpdate && itemToUpdate.youtube_id === '') {
        itemToUpdate.youtube_id = null;
    }
    
    const originalItem = data[dataKey].find(item => item.id === updatedItem.id);
    if (updatedItem.image_prompt && (updatedItem.image_prompt !== originalItem?.image_prompt || !updatedItem.image_url)) {
      itemToUpdate = await generateAndSetImageUrl(itemToUpdate);
    }
    
    const { data: returnedData, error } = await supabase
      .from(tableName)
      .update(itemToUpdate)
      .eq('id', updatedItem.id)
      .select()
      .single();

    if (error) throw error;

    setData(prev => ({
      ...prev,
      [dataKey]: (prev[dataKey] || []).map(item => (item.id === returnedData.id ? returnedData : item)).sort((a, b) => {
        if(dataKey === 'blog_posts') return new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at);
        return a.display_order - b.display_order;
      }),
    }));
    return returnedData;
  }, [data, siteId]);

  const deleteData = useCallback(async (type, itemId) => {
    const mapping = getTableAndKey(type);
    if (!mapping) throw new Error('Invalid type');
    const { table: tableName, key: dataKey } = mapping;

    const { error } = await supabase.from(tableName).delete().eq('id', itemId);

    if (error) throw error;

    setData(prev => ({
      ...prev,
      [dataKey]: (prev[dataKey] || []).filter(item => item.id !== itemId),
    }));
  }, []);

  const value = useMemo(() => ({
    data,
    loading: loading || loadingSite,
    fetchData,
    addData,
    updateData,
    deleteData,
  }), [data, loading, loadingSite, fetchData, addData, updateData, deleteData]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
