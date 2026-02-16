import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2, ArrowLeft, Home, AlertTriangle } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import { Button } from '@/components/ui/button';
import { useBookReader } from '@/contexts/BookReaderContext';

const BookReaderPage = () => {
  const { bookId } = useParams();
  const { books, loading, selectBookById } = useBookReader();
  const navigate = useNavigate();

  useEffect(() => {
    if (books.length > 0) {
      selectBookById(bookId);
    }
  }, [bookId, books, selectBookById]);
  
  const book = React.useMemo(() => {
    if (!books || books.length === 0) return null;
    return books.find(b => b.id === bookId);
  }, [books, bookId]);

  if (loading || !books || books.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!book) {
    return (
      <AnimatedPage>
        <div className="flex flex-col justify-center items-center min-h-screen bg-background text-foreground text-center px-4">
          <h1 className="text-4xl font-bold mb-4 text-glow">Book Not Found</h1>
          <p className="text-muted-foreground mb-8">We couldn't find the book you were looking for.</p>
          <Button onClick={() => navigate('/books')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Library
          </Button>
        </div>
      </AnimatedPage>
    );
  }

  const baseUrl = "https://www.mrpiglr.com";
  const pageUrl = `${baseUrl}/read-book/${book.id}`;
  const pageImage = book.image_url || `${baseUrl}/og-books.jpg`; 
  const pageDescription = book.long_description ? book.long_description.substring(0, 160) : `Read a sample of "${book.title}", a book on ${book.category}.`;

  return (
    <AnimatedPage>
      <Helmet>
        <title>Reading: {book.title} - MrPiglr</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={pageDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={`Reading: ${book.title} - MrPiglr`} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={`Reading: ${book.title} - MrPiglr`} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
      </Helmet>
      
      <div className="relative min-h-screen bg-background text-foreground">
        <div className="grid-background opacity-5"></div>
        <header className="sticky top-0 bg-background/80 backdrop-blur-sm z-20 border-b border-border/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Button variant="ghost" asChild>
                <Link to="/books">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline">Back to Library</span>
                </Link>
              </Button>
              <h1 className="text-xl font-bold text-center truncate text-glow">
                {book.title}
              </h1>
              <Button variant="ghost" asChild>
                <Link to="/">
                  <Home className="h-5 w-5" />
                   <span className="hidden sm:inline ml-2">Home</span>
                </Link>
              </Button>
            </div>
          </div>
        </header>
        
        <main className="relative z-10 max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {book.content && book.content.trim() !== '' ? (
            <article 
              className="prose prose-invert prose-lg max-w-none prose-headings:text-glow prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: book.content }}
              style={{fontFamily: 'Inter', fontWeight: 400, textTransform: 'none'}}
            />
          ) : (
            <div className="text-center bg-card/50 p-8 rounded-lg border border-border">
              <AlertTriangle className="mx-auto h-12 w-12 text-amber-400 mb-4"/>
              <h2 className="text-2xl font-bold mb-2">Content Not Available</h2>
              <p className="text-muted-foreground">The content for this book is not available for reading at the moment.</p>
            </div>
          )}
        </main>
      </div>
    </AnimatedPage>
  );
};

export default BookReaderPage;