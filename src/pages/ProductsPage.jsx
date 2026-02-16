import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ShoppingBag, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedPage from '@/components/AnimatedPage';
import { useAppContext } from '@/contexts/AppContext';

const ProductCard = ({ product, variants }) => {
  return (
    <motion.div
      className="bg-card rounded-xl border border-border flex flex-col group overflow-hidden transition-all duration-300 hover:border-primary hover:-translate-y-1 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
      variants={variants}
    >
      <div className="relative aspect-video overflow-hidden bg-secondary">
        <img src={product.image_url} alt={product.title} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 p-4" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-xl mb-2">{product.title}</h3>
        <p style={{ fontFamily: 'Inter', textTransform: 'none', fontWeight: 400 }} className="text-muted-foreground text-sm mb-4 flex-grow">{product.description}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {product.tags.map(tag => (
            <span key={tag} className="text-xs font-semibold px-2 py-1 rounded-full bg-secondary text-muted-foreground">{tag}</span>
          ))}
        </div>
        <Button asChild className="mt-auto">
          <a href={product.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            View in Store
          </a>
        </Button>
      </div>
    </motion.div>
  );
};

const ProductsPage = () => {
  const { data, loading } = useAppContext();
  const products = data.products || [];

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const baseUrl = "https://www.mrpiglr.com";
  const pageUrl = `${baseUrl}/products`;
  const pageImage = `${baseUrl}/og-products.jpg`;
  const pageDescription = "Check out the official merchandise for MrPiglr. High-quality apparel and more to support the channel.";

  return (
    <AnimatedPage>
      <Helmet>
        <title>Products - MrPiglr</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content="Products - MrPiglr" />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content="Products - MrPiglr" />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
      </Helmet>
      <motion.section id="products" className="py-24 px-6 min-h-screen relative" variants={sectionVariants} initial="hidden" animate="visible">
        <div className="grid-background opacity-10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-5xl font-bold text-center mb-4 text-glow">
            <ShoppingBag className="inline-block w-10 h-10 mr-3 text-primary" />
            Official Merch
          </h1>
          <p style={{ fontFamily: 'Inter', textTransform: 'none', fontWeight: 400 }} className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Support the content by grabbing some official gear. All products are handled through my secure storefront.
          </p>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} variants={itemVariants} />
              ))}
            </div>
          )}
        </div>
      </motion.section>
    </AnimatedPage>
  );
};

export default ProductsPage;