import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Star, ShoppingBag, ChevronLeft, ChevronRight, Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCustomToast } from '@/hooks/useCustomToast';
import AnimatedPage from '@/components/AnimatedPage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBookReader } from '@/contexts/BookReaderContext';
import { SiAmazon } from 'react-icons/si';

const iconMap = {
  Amazon: SiAmazon,
};

const StarRating = ({ rating }) => {
  if (typeof rating !== 'number') return null;

  const totalStars = 5;
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, i) => {
        const starValue = i + 1;
        return (
          <Star
            key={i}
            className={`w-4 h-4 ${
              starValue <= rating ? 'text-primary fill-current' : 'text-muted-foreground'
            }`}
          />
        );
      })}
      <span className="ml-2 text-sm text-muted-foreground" style={{fontFamily: 'Inter', fontWeight: 400}}>({rating.toFixed(1)})</span>
    </div>
  );
};

const BookDetailView = ({ book, onPrev, onNext }) => {
  const { toastNotImplemented } = useCustomToast();

  const handlePurchaseClick = (url) => {
    if (url === '#') {
      toastNotImplemented();
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!book) return null;

  return (
    <motion.div
      key={book.id}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: 'spring', stiffness: 250, damping: 30 }}
      className="bg-card/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-border purple-glow h-full flex flex-col"
    >
      <div className="relative mb-6">
        <div className="aspect-[4/3] rounded-lg overflow-hidden relative">
          <img src={book.image_url} alt={`Cover for ${book.title}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-3xl lg:text-4xl font-bold text-glow">{book.title}</h2>
          <p className="text-muted-foreground uppercase text-md" style={{fontFamily: 'Inter', fontWeight: 400}}>{book.category}</p>
        </div>
        <div className="absolute top-4 right-4">
          <StarRating rating={book.rating} />
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="flex-grow mt-4">
          <p style={{fontFamily: 'Inter', textTransform: 'none', fontWeight: 400}} className="text-foreground/90">{book.long_description}</p>
        </TabsContent>
        <TabsContent value="details" className="mt-4">
          <ul className="space-y-2" style={{fontFamily: 'Inter', textTransform: 'none', fontWeight: 400}}>
            <li><strong>RELEASED:</strong> {book.release_date}</li>
            <li><strong>CATEGORY:</strong> {book.category}</li>
            <li><strong>TAGS:</strong> {Array.isArray(book.tags) ? book.tags.join(', ') : ''}</li>
          </ul>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 pt-6 border-t border-border/20 flex flex-col gap-4">
        {book.is_free ? (
          <Button asChild className="w-full">
            <Link to={`/read-book/${book.id}`}>
              <Eye className="mr-2 h-4 w-4" /> READ FOR FREE
            </Link>
          </Button>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <h4 className="text-md font-bold uppercase">PURCHASE NOW</h4>
            <div className="flex gap-4">
              {book.purchase_links && book.purchase_links.map(link => {
                const Icon = iconMap[link.store] || ShoppingBag;
                return (
                    <Button key={link.store} variant="secondary" onClick={() => handlePurchaseClick(link.url)}>
                        <Icon className="mr-2 h-4 w-4" /> {link.store}
                    </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onPrev}><ChevronLeft className="w-4 h-4 mr-2" /> PREV</Button>
        <Button variant="outline" onClick={onNext}>NEXT <ChevronRight className="w-4 h-4 ml-2" /></Button>
      </div>
    </motion.div>
  );
};

const BookSelector = ({ books, currentBookIndex, selectBook }) => {
  return (
    <div className="bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border h-full flex flex-col">
      <h3 className="text-xl font-bold p-4">Library</h3>
      <div className="overflow-y-auto flex-grow custom-scrollbar pr-2 space-y-2">
        {books.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => selectBook(index)}
            className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 flex items-center gap-4 ${index === currentBookIndex ? 'bg-primary/20' : 'hover:bg-secondary'}`}
          >
            <div className="w-12 h-16 bg-secondary rounded-md flex-shrink-0 overflow-hidden">
              <img src={book.image_url} className="w-full h-full object-cover" alt={`Mini cover for ${book.title}`} />
            </div>
            <div>
              <p className="font-bold text-sm truncate">{book.title}</p>
              <p className="text-xs text-muted-foreground" style={{fontFamily: 'Inter', textTransform: 'none', fontWeight: 400}}>{book.category}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const BooksPage = () => {
  const { books, currentBook, currentBookIndex, selectBook, nextBook, prevBook, loading } = useBookReader();
  
  const baseUrl = "https://www.mrpiglr.com";
  const pageUrl = `${baseUrl}/books`;
  const pageImage = `${baseUrl}/og-books.jpg`; 
  const pageDescription = "Explore the published works of MrPiglr, including guides on game development, creative philosophy, and music production.";

  return (
    <AnimatedPage>
      <Helmet>
        <title>Books - MrPiglr</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={pageDescription} />
        
        <meta property="og:type" content="books.book" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content="Books - MrPiglr" />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:site_name" content="MrPiglr" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content="Books - MrPiglr" />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
      </Helmet>
      <section id="books" className="py-24 px-4 md:px-6 min-h-screen relative">
        <div className="grid-background opacity-10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-5xl font-bold text-center mb-4 text-glow">
            <BookOpen className="inline-block w-10 h-10 mr-2 text-primary" /> My Library
          </h1>
          <p style={{fontFamily: 'Inter', textTransform: 'none', fontWeight: 400}} className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            An interactive showcase of my published works. Select a book from the library to learn more.
          </p>
          
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {currentBook ? (
                     <BookDetailView key={currentBook.id} book={currentBook} onPrev={prevBook} onNext={nextBook} />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-card/50 p-8 rounded-2xl border border-border">
                        <p className="text-muted-foreground">Select a book to see details.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
              <div className="lg:col-span-1 h-full min-h-[50vh] lg:min-h-0">
                <BookSelector books={books} currentBookIndex={currentBookIndex} selectBook={selectBook} />
              </div>
            </div>
          )}
        </div>
      </section>
    </AnimatedPage>
  );
};

export default BooksPage;