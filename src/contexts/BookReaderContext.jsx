import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAppContext } from './AppContext';

const BookReaderContext = createContext(null);

export const BookReaderProvider = ({ children }) => {
  const { data, loading } = useAppContext();
  const [books, setBooks] = useState([]);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);

  useEffect(() => {
    if (!loading && data?.books) {
      const sortedBooks = [...data.books].sort((a, b) => a.display_order - b.display_order);
      setBooks(sortedBooks);
      if (sortedBooks.length > 0 && currentBookIndex >= sortedBooks.length) {
        setCurrentBookIndex(0);
      }
    }
  }, [data, loading, currentBookIndex]);

  const currentBook = useMemo(() => {
    if (books && books.length > 0) {
      return books[currentBookIndex];
    }
    return null;
  }, [books, currentBookIndex]);

  const selectBook = useCallback((index) => {
    if (index >= 0 && index < books.length) {
      setCurrentBookIndex(index);
    }
  }, [books.length]);

  const selectBookById = useCallback((bookId) => {
    const index = books.findIndex(b => b.id === bookId);
    if (index !== -1) {
      setCurrentBookIndex(index);
    }
  }, [books]);


  const nextBook = useCallback(() => {
    if (books.length === 0) return;
    setCurrentBookIndex((prevIndex) => (prevIndex + 1) % books.length);
  }, [books.length]);

  const prevBook = useCallback(() => {
    if (books.length === 0) return;
    setCurrentBookIndex((prevIndex) => (prevIndex - 1 + books.length) % books.length);
  }, [books.length]);

  const value = {
    books,
    currentBook,
    currentBookIndex,
    selectBook,
    selectBookById,
    nextBook,
    prevBook,
    loading: loading || !data,
  };

  return <BookReaderContext.Provider value={value}>{children}</BookReaderContext.Provider>;
};

export const useBookReader = () => {
  const context = useContext(BookReaderContext);
  if (context === undefined) {
    throw new Error('useBookReader must be used within a BookReaderProvider');
  }
  return context;
};