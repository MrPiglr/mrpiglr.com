import React, { createContext, useState, useContext, useEffect } from 'react';
import { allContent as initialContent } from '@/data/siteContent';

const ContentContext = createContext(null);

const generateId = () => `id_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedContent = localStorage.getItem('mrpiglr-content');
      if (storedContent) {
        setContent(JSON.parse(storedContent));
      } else {
        const contentWithIds = initialContent.map(item => ({ ...item, id: generateId() }));
        setContent(contentWithIds);
        localStorage.setItem('mrpiglr-content', JSON.stringify(contentWithIds));
      }
    } catch (error) {
      console.error("Failed to load content from localStorage:", error);
      const contentWithIds = initialContent.map(item => ({ ...item, id: generateId() }));
      setContent(contentWithIds);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLocalStorage = (newContent) => {
    try {
      localStorage.setItem('mrpiglr-content', JSON.stringify(newContent));
    } catch (error) {
      console.error("Failed to save content to localStorage:", error);
    }
  };

  const addContent = (newItem) => {
    return new Promise((resolve) => {
      setContent(prevContent => {
        const newContent = [...prevContent, { ...newItem, id: generateId() }];
        updateLocalStorage(newContent);
        resolve();
        return newContent;
      });
    });
  };

  const updateContent = (id, updatedItem) => {
    return new Promise((resolve) => {
      setContent(prevContent => {
        const newContent = prevContent.map(item => (item.id === id ? { ...item, ...updatedItem } : item));
        updateLocalStorage(newContent);
        resolve();
        return newContent;
      });
    });
  };

  const deleteContent = (id) => {
    return new Promise((resolve) => {
      setContent(prevContent => {
        const newContent = prevContent.filter(item => item.id !== id);
        updateLocalStorage(newContent);
        resolve();
        return newContent;
      });
    });
  };

  const value = {
    content,
    loading,
    addContent,
    updateContent,
    deleteContent,
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};