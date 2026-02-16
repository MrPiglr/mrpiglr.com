import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Store as StoreIcon } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import ProductsList from '@/components/ProductsList';

const StorePage = () => {
  const baseUrl = "https://www.mrpiglr.com";
  const pageUrl = `${baseUrl}/store`;
  const pageImage = `${baseUrl}/og-store.jpg`;
  const pageDescription = "Browse the official MrPiglr store for merchandise, digital products, and exclusive items.";

  return (
    <AnimatedPage>
      <Helmet>
        <title>Store - MrPiglr</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content="Store - MrPiglr" />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content="Store - MrPiglr" />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
      </Helmet>
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <StoreIcon className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-5xl font-bold text-glow">Official Store</h1>
          <p className="text-xl text-muted-foreground mt-2">Merchandise, digital goods, and exclusive items.</p>
        </motion.div>

        <ProductsList />
      </div>
    </AnimatedPage>
  );
};

export default StorePage;